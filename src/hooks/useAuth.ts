/**
 * Authentication and Authorization Hook
 * Provides auth state and role-based access control
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthChange, AuthUser, UserRole } from '@/services/authService';

export interface UseAuthReturn {
  user: AuthUser | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  isPending: boolean;
}

/**
 * Hook to get current auth state and role
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const role = user?.role || null;
  const isAuthenticated = !!user;
  const isAdmin = role === 'admin';
  const isSeller = role === 'approved';
  const isPending = role === 'pending';

  return {
    user,
    role,
    loading,
    isAuthenticated,
    isAdmin,
    isSeller,
    isPending,
  };
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
