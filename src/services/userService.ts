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
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/types/user';

/**
 * Get all users
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    const users: User[] = [];

    querySnapshot.forEach((doc) => {
      users.push({
        uid: doc.id,
        ...(doc.data() as Omit<User, 'uid'>),
      } as User);
    });

    // Sort by createdAt descending
    users.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
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
      return {
        uid: docSnap.id,
        ...(docSnap.data() as Omit<User, 'uid'>),
      } as User;
    }

    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
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
