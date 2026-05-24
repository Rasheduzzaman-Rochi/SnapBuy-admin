/**
 * Authentication Service
 * Handles Firebase Auth and role determination
 * 
 * NOTE: This should only run on the client side
 */

'use client';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'approved' | 'pending' | 'rejected' | 'none';

export interface AuthUser extends User {
  role?: UserRole;
}

export interface AdminProfile {
  uid: string;
  email: string;
  name?: string;
  createdAt?: any;
}

/**
 * Determine user role based on Firestore collections
 * 
 * Logic:
 * - If admins/{uid} exists → role = "admin"
 * - Else if sellerApplications/{uid}.status == "approved" → role = "approved"
 * - Else if sellerApplications/{uid}.status == "pending" → role = "pending"
 * - Else if sellerApplications/{uid}.status == "rejected" → role = "rejected"
 * - Else → role = "none"
 */
export async function getUserAccessRole(uid: string): Promise<UserRole> {
  try {
    console.log('🔍 Getting role for UID:', uid);

    // Check if admin FIRST
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    console.log('👤 Admin doc exists?', adminDoc.exists());
    
    if (adminDoc.exists()) {
      console.log('✅ Admin role detected, admin data:', adminDoc.data());
      return 'admin';
    } else {
      console.log('⚠️ Admin doc NOT found. Path checked: admins/' + uid);
    }

    // Check seller application status
    const sellerAppDoc = await getDoc(doc(db, 'sellerApplications', uid));
    console.log('🏪 Seller app doc exists?', sellerAppDoc.exists());
    
    if (sellerAppDoc.exists()) {
      const status = sellerAppDoc.data().status;
      console.log('📋 Seller application status:', status);
      
      if (status === 'approved') return 'approved';
      if (status === 'pending') return 'pending';
      if (status === 'rejected') return 'rejected';
    } else {
      console.log('⚠️ Seller app doc NOT found. Path checked: sellerApplications/' + uid);
    }

    console.log('⚠️ No role found, returning "none"');
    return 'none';
  } catch (error: any) {
    console.error('❌ Error getting user role:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);
    return 'none';
  }
}

export async function getAdminProfile(uid: string): Promise<AdminProfile | null> {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', uid));

    if (!adminDoc.exists()) {
      return null;
    }

    const data = adminDoc.data() as any;

    return {
      uid: adminDoc.id,
      email: data.email ?? '',
      name: data.name ?? '',
      createdAt: data.createdAt ?? null,
    };
  } catch (error) {
    console.error('Error getting admin profile:', error);
    return null;
  }
}

/**
 * Login with email and password
 */
export async function loginWithEmail(email: string, password: string) {
  try {
    console.log('🔑 Attempting login with:', email);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('✅ Firebase Auth successful! UID:', user.uid, 'Email:', user.email);

    // Get role
    const role = await getUserAccessRole(user.uid);
    
    console.log('🎯 Final role result:', role);

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        role,
      },
    };
  } catch (error: any) {
    console.error('❌ Login error:', error.message);
    return {
      success: false,
      error: error.message || 'Login failed',
    };
  }
}

/**
 * Register new seller
 */
export async function registerSeller(
  email: string,
  password: string,
  sellerData: {
    ownerName: string;
    shopName: string;
    phone: string;
    address: string;
    category: string;
  }
) {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Create user document
    await setDoc(doc(db, 'users', uid), {
      uid,
      email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Create seller application
    await setDoc(doc(db, 'sellerApplications', uid), {
      uid,
      ownerName: sellerData.ownerName,
      shopName: sellerData.shopName,
      email,
      phone: sellerData.phone,
      address: sellerData.address,
      category: sellerData.category,
      status: 'pending',
      createdAt: serverTimestamp(),
      approvedAt: null,
      approvedBy: null,
      rejectedAt: null,
      rejectedBy: null,
    });

    return {
      success: true,
      uid,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Registration failed',
    };
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): Promise<AuthUser | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        const role = await getUserAccessRole(user.uid);
        resolve({ ...user, role } as AuthUser);
      } else {
        resolve(null);
      }
    }, reject);
  });
}

/**
 * Logout
 */
export async function logout() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Logout failed',
    };
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: AuthUser | null) => void) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const role = await getUserAccessRole(user.uid);
      callback({ ...user, role } as AuthUser);
    } else {
      callback(null);
    }
  });
}
