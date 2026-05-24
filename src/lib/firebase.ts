/**
 * Firebase Configuration
 * Initialize Firebase app, Auth, Firestore, and Storage
 * 
 * NOTE: This should only run on the client side
 */

'use client';

export { app as default, app } from '@/lib/firebaseApp';
export { auth } from '@/lib/firebaseAuth';
export { db } from '@/lib/firebaseDb';
export { storage } from '@/lib/firebaseStorage';
