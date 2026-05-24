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
import { db } from '@/lib/firebaseDb';
import { Order } from '@/types/order';
import { UserRole } from './authService';
import { toMillis } from '@/lib/utils';
import { orderBelongsToSeller, type SellerContext } from '@/lib/sellerOwnership';

function mapOrder(docId: string, data: any): Order {
  const items = Array.isArray(data.items) ? data.items : [];

  return {
    id: docId,
    customerName: data.customerName ?? data.customer?.name ?? '',
    customerEmail: data.customerEmail ?? data.customer?.email ?? '',
    customerPhone: data.customerPhone ?? data.customer?.phone ?? '',
    customerAddress: data.customerAddress ?? data.customer?.address ?? data.shippingAddress ?? '',
    items: items.map((item: any) => ({
      productId: item.productId ?? '',
      productName: item.productName ?? item.name ?? '',
      quantity: Number(item.quantity ?? 0),
      price: Number(item.price ?? 0),
      total: Number(item.total ?? Number(item.price ?? 0) * Number(item.quantity ?? 0)),
      sellerId: item.sellerId ?? undefined,
      sellerName: item.sellerName ?? undefined,
      shopName: item.shopName ?? item.storeName ?? undefined,
      imageUrl: item.imageUrl || item.imageURL || item.image || item.photoUrl || undefined,
    })),
    total: Number(data.total ?? data.totalAmount ?? 0),
    orderStatus: data.orderStatus ?? data.status ?? 'placed',
    paymentStatus: data.paymentStatus ?? 'pending',
    paymentGateway: data.paymentGateway ?? '',
    sellerId: data.sellerId ?? undefined,
    sellerIds: Array.isArray(data.sellerIds) ? data.sellerIds : data.sellerId ? [data.sellerId] : [],
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
}

function sortOrdersByCreatedAt(orders: Order[]): Order[] {
  return [...orders].sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
}

async function getOrdersFromQuery(ordersQuery: ReturnType<typeof query>): Promise<Order[]> {
  const querySnapshot = await getDocs(ordersQuery);
  const orders: Order[] = [];

  querySnapshot.forEach((doc) => {
    orders.push(mapOrder(doc.id, doc.data()));
  });

  return orders;
}

/**
 * Get orders based on role and user ID
 * - admin: get all orders
 * - seller: get orders where sellerIds contains uid, then legacy item/shop fallback if needed
 */
export async function getOrders(role: UserRole, uid?: string, sellerContext?: SellerContext | null): Promise<Order[]> {
  try {
    if (role !== 'admin' && !uid) {
      return [];
    }

    const ordersRef = collection(db, 'orders');

    if (role === 'admin') {
      const orders = await getOrdersFromQuery(query(ordersRef));
      return sortOrdersByCreatedAt(orders);
    }

    const sellerIdOrders = await getOrdersFromQuery(
      query(ordersRef, where('sellerIds', 'array-contains', uid))
    );

    if (sellerIdOrders.length > 0) {
      return sortOrdersByCreatedAt(sellerIdOrders);
    }

    const orders = await getOrdersFromQuery(query(ordersRef));
    const visibleOrders = orders.filter((order) =>
      orderBelongsToSeller(order, sellerContext ?? { uid: uid ?? '' })
    );

    return sortOrdersByCreatedAt(visibleOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
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
      return mapOrder(docSnap.id, docSnap.data());
    }

    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
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
