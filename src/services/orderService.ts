/**
 * Orders Service
 * Handles order operations with Firestore
 */

'use client';

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types/order';
import { UserRole } from './authService';

/**
 * Get orders based on role and user ID
 * - admin: get all orders
 * - seller: get orders where sellerIds array contains uid
 */
export async function getOrders(role: UserRole, uid?: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders');
    let q;

    if (role === 'admin') {
      q = query(ordersRef);
    } else {
      // Seller: orders containing their sellerId in sellerIds array
      q = query(ordersRef, where('sellerIds', 'array-contains', uid));
    }

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...(doc.data() as Omit<Order, 'id'>),
      } as Order);
    });

    // Sort by createdAt descending
    orders.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

/**
 * Get single order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Order;
    }

    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order['orderStatus']
) {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      orderStatus: status,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      error: error.message || 'Failed to update order status',
    };
  }
}

/**
 * Get order count for admin dashboard
 */
export async function getTotalOrdersCount(): Promise<number> {
  try {
    const ordersRef = collection(db, 'orders');
    const snapshot = await getDocs(ordersRef);
    return snapshot.size;
  } catch (error) {
    console.error('Error fetching orders count:', error);
    return 0;
  }
}

/**
 * Get total sales for admin/seller
 */
export async function getTotalSales(role: UserRole, uid?: string): Promise<number> {
  try {
    const orders = await getOrders(role, uid);
    return orders.reduce((sum, order) => sum + order.total, 0);
  } catch (error) {
    console.error('Error calculating total sales:', error);
    return 0;
  }
}

/**
 * Get pending orders count for seller
 */
export async function getPendingOrdersCount(uid: string): Promise<number> {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('sellerIds', 'array-contains', uid),
      where('orderStatus', '==', 'placed')
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error fetching pending orders count:', error);
    return 0;
  }
}
