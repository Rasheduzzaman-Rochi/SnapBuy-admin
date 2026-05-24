'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useMemo, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { useDashboardSearch } from '@/components/providers/DashboardSearchProvider';
import { useAuth } from '@/hooks/useAuth';
import { useSellerContext } from '@/hooks/useSellerContext';
import { getOrders } from '@/services/orderService';
import { Order } from '@/types/order';
import { AccessDenied } from '@/components/ui/AccessDenied';

const OrdersTable = dynamic(
  () => import('@/components/orders/OrdersTable').then((mod) => mod.OrdersTable),
  {
    loading: () => (
      <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900" />
    ),
  }
);

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStatus, setOrderStatus] = useState('All');
  const [paymentStatus, setPaymentStatus] = useState('All');
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { query } = useDashboardSearch();
  const { user, role, loading } = useAuth();
  const { sellerContext, loading: sellerContextLoading } = useSellerContext(user, role);
  const uid = user?.uid;
  const email = user?.email;
  const sellerShopName = sellerContext?.shopName ?? '';
  const fetchKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (loading || sellerContextLoading || !role) return;

    if (role !== 'admin' && role !== 'approved') {
      setOrders([]);
      return;
    }

    if (role === 'approved' && !uid) return;

    const fetchKey = `${role}:${uid ?? 'admin'}:${sellerShopName}`;
    if (fetchKeyRef.current === fetchKey) return;
    fetchKeyRef.current = fetchKey;

    let mounted = true;

    async function loadOrders() {
      try {
        setDataLoading(true);
        setError(null);
        const orders = await getOrders(
          role,
          uid,
          role === 'approved' ? { uid: uid ?? '', email, shopName: sellerShopName } : null
        );
        if (mounted) setOrders(orders);
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Failed to load orders.');
      } finally {
        if (mounted) setDataLoading(false);
      }
    }

    loadOrders();

    return () => {
      mounted = false;
    };
  }, [email, loading, role, sellerContextLoading, sellerShopName, uid]);

  const orderStatuses = ['All', 'placed', 'processing', 'shipped', 'delivered', 'cancelled'];
  const paymentStatuses = ['All', 'pending', 'paid_test', 'paid', 'failed'];
  const filteredOrders = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm) ||
        order.customerName.toLowerCase().includes(searchTerm) ||
        order.customerEmail.toLowerCase().includes(searchTerm) ||
        order.customerPhone.toLowerCase().includes(searchTerm) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(searchTerm) ||
          (item.sellerName ?? '').toLowerCase().includes(searchTerm) ||
          (item.shopName ?? '').toLowerCase().includes(searchTerm)
        );
      const matchesOrderStatus = orderStatus === 'All' || order.orderStatus === orderStatus;
      const matchesPaymentStatus = paymentStatus === 'All' || order.paymentStatus === paymentStatus;
      return matchesSearch && matchesOrderStatus && matchesPaymentStatus;
    });
  }, [orderStatus, orders, paymentStatus, query]);

  if (loading || sellerContextLoading || dataLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[50vh] items-center justify-center text-slate-600 dark:text-slate-300">
          Loading orders...
        </div>
      </DashboardLayout>
    );
  }

  if (role !== 'admin' && role !== 'approved') {
    return (
      <DashboardLayout>
        <AccessDenied />
      </DashboardLayout>
    );
  }

  const isAdmin = role === 'admin';
  const pageTitle = isAdmin ? 'All Orders' : 'My Orders';
  const pageDescription = isAdmin 
    ? `Managing ${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''}`
    : `Your ${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''}`;

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Header */}
        <PageHeader
          title={pageTitle}
          description={pageDescription}
        />

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2 dark:text-slate-100">Order Status</label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="select-field w-full"
              >
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2 dark:text-slate-100">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="select-field w-full"
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All'
                      ? 'All Payment Status'
                      : status === 'paid_test'
                        ? 'Paid (Test)'
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <p className="text-sm text-slate-500 dark:text-slate-400">Use the top search bar to search by order ID, customer, email, phone, or product.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Orders Table */}
        <OrdersTable orders={filteredOrders} />
      </div>
    </DashboardLayout>
  );
}
