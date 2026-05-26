/**
 * Seller Applications Service
 * Admin operations on seller applications
 */

'use client';

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseDb';
import { SellerApplication } from '@/types/seller';
import { toMillis } from '@/lib/utils';

export interface SellerApplicationFormData {
  name: string;
  mobile: string;
  phone?: string;
  shopName: string;
  address: string;
  category: string;
}

function mapSellerApplication(docId: string, data: any): SellerApplication {
  return {
    uid: docId,
    ownerName: data.ownerName ?? data.owner ?? '',
    shopName: data.shopName ?? data.storeName ?? '',
    email: data.email ?? '',
    mobile: data.mobile ?? data.phone ?? '',
    phone: data.phone ?? data.mobile ?? '',
    address: data.address ?? '',
    category: data.category ?? '',
    status: (data.status || 'pending').toString().toLowerCase() as 'pending' | 'approved' | 'rejected',
    createdAt: data.createdAt ?? data.created_at ?? null,
    updatedAt: data.updatedAt ?? null,
    approvedAt: data.approvedAt ?? null,
    approvedBy: data.approvedBy ?? null,
    rejectedAt: data.rejectedAt ?? null,
    rejectedBy: data.rejectedBy ?? null,
    rejectionReason: data.rejectionReason ?? null,
  };
}

export async function createSellerApplicationForUser(
  user: { uid: string; email?: string | null },
  formData: SellerApplicationFormData,
  options?: { includeUserCreatedAt?: boolean }
) {
  const name = formData.name.trim();
  const mobile = formData.mobile.trim();
  const email = user.email ?? '';
  const shopPhone = formData.phone?.trim() || mobile;
  const userPayload: Record<string, any> = {
    uid: user.uid,
    name,
    email,
    mobile,
    phone: mobile,
    provider: 'password',
    accountType: 'buyer',
    sellerStatus: 'pending',
    isSeller: false,
    status: 'active',
    updatedAt: serverTimestamp(),
  };

  if (options?.includeUserCreatedAt) {
    userPayload.createdAt = serverTimestamp();
  }

  await setDoc(doc(db, 'users', user.uid), userPayload, { merge: true });

  await setDoc(doc(db, 'sellerApplications', user.uid), {
    uid: user.uid,
    email,
    ownerName: name,
    mobile,
    phone: shopPhone,
    shopName: formData.shopName.trim(),
    address: formData.address.trim(),
    category: formData.category,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    approvedAt: null,
    approvedBy: null,
    rejectedAt: null,
    rejectedBy: null,
  });

  return { success: true };
}

/**
 * Get all seller applications
 */
export async function getSellerApplications(): Promise<SellerApplication[]> {
  try {
    const appsRef = collection(db, 'sellerApplications');
    const querySnapshot = await getDocs(appsRef);
    const apps: SellerApplication[] = [];

    querySnapshot.forEach((doc) => {
      apps.push(mapSellerApplication(doc.id, doc.data()));
    });

    // Sort by createdAt descending (handle Firestore Timestamp safely)
    apps.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));

    return apps;
  } catch (error) {
    console.error('Error fetching seller applications:', error);
    throw error;
  }
}

/**
 * Get seller application by UID
 */
export async function getSellerApplication(uid: string): Promise<SellerApplication | null> {
  try {
    const docRef = doc(db, 'sellerApplications', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return mapSellerApplication(docSnap.id, docSnap.data());
    }

    return null;
  } catch (error) {
    console.error('Error fetching seller application:', error);
    throw error;
  }
}

/**
 * Get applications by status
 */
export async function getSellerApplicationsByStatus(
  status: 'pending' | 'approved' | 'rejected'
): Promise<SellerApplication[]> {
  try {
    const appsRef = collection(db, 'sellerApplications');
    const q = query(appsRef, where('status', '==', status));
    const querySnapshot = await getDocs(q);
    const apps: SellerApplication[] = [];

    querySnapshot.forEach((doc) => {
      apps.push(mapSellerApplication(doc.id, doc.data()));
    });

    return apps;
  } catch (error) {
    console.error('Error fetching seller applications by status:', error);
    throw error;
  }
}

/**
 * Approve seller application
 */
export async function approveSeller(uid: string, approvedBy: string) {
  try {
    const docRef = doc(db, 'sellerApplications', uid);
    await updateDoc(docRef, {
      status: 'approved',
      updatedAt: serverTimestamp(),
      approvedAt: serverTimestamp(),
      approvedBy,
      rejectedAt: null,
      rejectedBy: null,
      rejectionReason: null,
    });

    await setDoc(doc(db, 'users', uid), {
      sellerStatus: 'approved',
      isSeller: true,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    return { success: true };
  } catch (error: any) {
    console.error('Error approving seller:', error);
    return {
      success: false,
      error: error.message || 'Failed to approve seller',
    };
  }
}

/**
 * Reject seller application
 */
export async function rejectSeller(uid: string, rejectedBy: string, reason?: string) {
  try {
    const docRef = doc(db, 'sellerApplications', uid);
    await updateDoc(docRef, {
      status: 'rejected',
      updatedAt: serverTimestamp(),
      rejectedAt: serverTimestamp(),
      rejectedBy,
      rejectionReason: reason || null,
      approvedAt: null,
      approvedBy: null,
    });

    await setDoc(doc(db, 'users', uid), {
      sellerStatus: 'rejected',
      isSeller: false,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    return { success: true };
  } catch (error: any) {
    console.error('Error rejecting seller:', error);
    return {
      success: false,
      error: error.message || 'Failed to reject seller',
    };
  }
}

/**
 * Remove seller dashboard access while keeping the buyer user account.
 */
export async function deleteSellerApplication(uid: string) {
  try {
    await deleteDoc(doc(db, 'sellerApplications', uid));
    await setDoc(doc(db, 'users', uid), {
      sellerStatus: 'removed',
      isSeller: false,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    return { success: true };
  } catch (error: any) {
    console.error('Error removing seller application:', error);
    return {
      success: false,
      error: error.message || 'Failed to remove seller',
    };
  }
}

/**
 * Get pending sellers count
 */
export async function getPendingSellersCount(): Promise<number> {
  try {
    const appsRef = collection(db, 'sellerApplications');
    const q = query(appsRef, where('status', '==', 'pending'));
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error fetching pending sellers count:', error);
    return 0;
  }
}
