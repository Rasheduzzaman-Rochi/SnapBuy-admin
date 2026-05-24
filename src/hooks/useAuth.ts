/**
 * Authentication and Authorization Hook
 * Provides auth state and role-based access control
 */

'use client';

import {
  createContext,
  createElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebaseAuth';
import type { AuthUser, UserRole, AdminProfile } from '@/services/authService';
import type { SellerApplication } from '@/types/seller';
import type { User as AppUser } from '@/types/user';
import { getSellerShopName, type SellerContext } from '@/lib/sellerOwnership';

export interface UseAuthReturn {
  user: AuthUser | null;
  role: UserRole | null;
  adminProfile: AdminProfile | null;
  sellerProfile: SellerApplication | null;
  userProfile: AppUser | null;
  sellerContext: SellerContext | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  isPending: boolean;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<UseAuthReturn | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [sellerProfile, setSellerProfile] = useState<SellerApplication | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const loadedUidRef = useRef<string | null>(null);

  const loadRoleAndProfiles = useCallback(async (user: AuthUser | null, force = false) => {
    if (!user) {
      loadedUidRef.current = null;
      setFirebaseUser(null);
      setRole(null);
      setAdminProfile(null);
      setSellerProfile(null);
      setUserProfile(null);
      return;
    }

    if (!force && loadedUidRef.current === user.uid) {
      return;
    }

    const { getAdminProfile, getUserAccessRole } = await import('@/services/authService');
    const nextRole = await getUserAccessRole(user.uid);
    const nextUser = { ...user, role: nextRole } as AuthUser;
    loadedUidRef.current = user.uid;
    const { getUserById } = await import('@/services/userService');
    const nextUserProfile = await getUserById(user.uid).catch((error) => {
      console.error('Error loading user profile:', error);
      return null;
    });

    setFirebaseUser(nextUser);
    setRole(nextRole);
    setUserProfile(nextUserProfile);

    if (nextRole === 'admin') {
      const profile = await getAdminProfile(user.uid);
      setAdminProfile(profile);
      setSellerProfile(null);
      return;
    }

    setAdminProfile(null);

    if (nextRole === 'approved' || nextRole === 'pending' || nextRole === 'rejected') {
      const { getSellerApplication } = await import('@/services/sellerService');
      const profile = await getSellerApplication(user.uid);
      setSellerProfile(profile);
      return;
    }

    setSellerProfile(null);
  }, []);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!mounted) return;
        setLoading(true);
        await loadRoleAndProfiles(user as AuthUser | null);
      } finally {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [loadRoleAndProfiles]);

  const refreshRole = useCallback(async () => {
    setLoading(true);
    try {
      await loadRoleAndProfiles(auth.currentUser as AuthUser | null, true);
    } finally {
      setLoading(false);
    }
  }, [loadRoleAndProfiles]);

  const sellerContext = useMemo<SellerContext | null>(() => {
    if (!firebaseUser || role !== 'approved') return null;

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      shopName: getSellerShopName(firebaseUser.email, sellerProfile?.shopName),
    };
  }, [firebaseUser, role, sellerProfile?.shopName]);

  const value = useMemo<UseAuthReturn>(() => {
    const isAuthenticated = !!firebaseUser;
    const isAdmin = role === 'admin';
    const isSeller = role === 'approved';
    const isPending = role === 'pending';

    return {
      user: firebaseUser,
      role,
      adminProfile,
      sellerProfile,
      userProfile,
      sellerContext,
      loading,
      isAuthenticated,
      isAdmin,
      isSeller,
      isPending,
      refreshRole,
    };
  }, [adminProfile, firebaseUser, loading, refreshRole, role, sellerContext, sellerProfile, userProfile]);

  return createElement(AuthContext.Provider, { value }, children);
}

/**
 * Hook to get current auth state and role
 */
export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

/**
 * Hook to protect routes that require authentication
 * Redirects to login if not authenticated
 */
export function useAuthProtection(redirectPath = '/login') {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectPath);
    }
  }, [loading, isAuthenticated, router, redirectPath]);

  return { user, loading, isAuthenticated };
}

/**
 * Hook to protect routes that require admin role
 * Redirects to dashboard if not admin
 */
export function useAdminProtection() {
  const router = useRouter();
  const { user, role, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/dashboard');
    }
  }, [loading, isAdmin, router]);

  return { user, role, loading, isAdmin };
}

/**
 * Hook to protect routes that require seller role
 * Redirects based on role status
 */
export function useSellerProtection() {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && role === 'pending') {
      router.push('/pending-approval');
    } else if (!loading && role === 'rejected') {
      router.push('/login');
    } else if (!loading && role === 'none') {
      router.push('/register-seller');
    }
  }, [loading, user, role, router]);

  return { user, role, loading, isSeller: role === 'approved' };
}
