/**
 * Users Service
 * Handles user operations for admin dashboard
 */

'use client';

import {
  collection,
  getDocs,
  getDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseDb';
import { User } from '@/types/user';
import { toMillis } from '@/lib/utils';

function mapUser(docId: string, data: any): User {
  return {
    uid: docId,
    name: data.name ?? data.displayName ?? data.email ?? 'Unnamed User',
    email: data.email ?? '',
    mobile: data.mobile ?? data.phone ?? '',
    phone: data.phone ?? data.mobile ?? '',
    provider: data.provider ?? data.providerId ?? 'email',
    accountType: data.accountType ?? '',
    sellerStatus: data.sellerStatus ?? '',
    isSeller: data.isSeller ?? false,
    status: data.status ?? 'active',
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
}

/**
 * Get all users
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    const users: User[] = [];

    querySnapshot.forEach((doc) => {
      users.push(mapUser(doc.id, doc.data()));
    });

    // Sort by createdAt descending
    users.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Get user by UID
 */
export async function getUserById(uid: string): Promise<User | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return mapUser(docSnap.id, docSnap.data());
    }

    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

/**
 * Get total users count
 */
export async function getTotalUsersCount(): Promise<number> {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error fetching users count:', error);
    return 0;
  }
}
