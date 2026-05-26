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
} from 'firebase/auth';
import { auth } from '@/lib/firebaseAuth';
import { db } from '@/lib/firebaseDb';
import { doc, getDoc } from 'firebase/firestore';
import { createSellerApplicationForUser, type SellerApplicationFormData } from '@/services/sellerService';

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
    // Check if admin FIRST
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    
    if (adminDoc.exists()) {
      return 'admin';
    }

    // Check seller application status
    const sellerAppDoc = await getDoc(doc(db, 'sellerApplications', uid));
    
    if (sellerAppDoc.exists()) {
      const status = sellerAppDoc.data().status;
      
      if (status === 'approved') return 'approved';
      if (status === 'pending') return 'pending';
      if (status === 'rejected') return 'rejected';
    }

    return 'none';
  } catch (error: any) {
    console.error('Error getting user role:', error);
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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
      },
    };
  } catch (error: any) {
    console.error('Login error:', error.message);
    const errorCode = error.code || '';
    const friendlyMessage =
      errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential'
        ? 'Password is incorrect. Please try again or reset your password.'
        : errorCode === 'auth/user-not-found'
          ? 'No account found with this email.'
          : error.message || 'Login failed';

    return {
      success: false,
      code: errorCode,
      error: friendlyMessage,
    };
  }
}

/**
 * Register new seller
 */
export async function registerSeller(
  email: string,
  password: string,
  sellerData: SellerApplicationFormData
) {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createSellerApplicationForUser(userCredential.user, sellerData, { includeUserCreatedAt: true });

    return {
      success: true,
      uid: userCredential.user.uid,
    };
  } catch (error: any) {
    const errorCode = error.code || '';
    const friendlyMessage = errorCode === 'auth/email-already-in-use'
      ? 'This email already has an account. Please login with this email to apply as a seller again.'
      : error.message || 'Registration failed';

    return {
      success: false,
      code: errorCode,
      error: friendlyMessage,
    };
  }
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
