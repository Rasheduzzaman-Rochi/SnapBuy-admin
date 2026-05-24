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
    name: string;
    mobile: string;
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
    const name = sellerData.name.trim();
    const mobile = sellerData.mobile.trim();
    const shopPhone = sellerData.phone.trim() || mobile;

    // Create/update buyer/general user profile for mobile app compatibility.
    await setDoc(doc(db, 'users', uid), {
      uid,
      name,
      email,
      mobile,
      phone: mobile,
      provider: 'password',
      accountType: 'buyer',
      sellerStatus: 'pending',
      isSeller: false,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Create seller application
    await setDoc(doc(db, 'sellerApplications', uid), {
      uid,
      email,
      ownerName: name,
      mobile,
      phone: shopPhone,
      shopName: sellerData.shopName.trim(),
      address: sellerData.address.trim(),
      category: sellerData.category,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
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
