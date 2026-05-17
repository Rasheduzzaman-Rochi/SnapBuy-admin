'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { mockOrders } from '@/data/mockData';
import { useDashboardSearch } from '@/components/providers/DashboardSearchProvider';
import { useAuth } from '@/hooks/useAuth';

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [orderStatus, setOrderStatus] = useState('All');
  const [paymentStatus, setPaymentStatus] = useState('All');
  const { query } = useDashboardSearch();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (role === 'approved' && user?.uid) {
      setOrders(mockOrders.filter((o) => o.sellerId === user.uid));
    } else {
      setOrders(mockOrders);
    }
  }, [role, user?.uid]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[50vh] items-center justify-center text-slate-600 dark:text-slate-300">
          Loading orders...
        </div>
      </DashboardLayout>
    );
  }

  const orderStatuses = ['All', 'placed', 'processing', 'shipped', 'delivered', 'cancelled'];
  const paymentStatuses = ['All', 'pending', 'paid_test', 'paid', 'failed'];
  const searchTerm = query.trim().toLowerCase();

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm) ||
      order.customerEmail.toLowerCase().includes(searchTerm) ||
      order.customerPhone.toLowerCase().includes(searchTerm);
    const matchesOrderStatus = orderStatus === 'All' || order.orderStatus === orderStatus;
    const matchesPaymentStatus = paymentStatus === 'All' || order.paymentStatus === paymentStatus;
    return matchesSearch && matchesOrderStatus && matchesPaymentStatus;
  });

  const isAdmin = role === 'admin';
  const pageTitle = isAdmin ? 'All Orders' : 'My Orders';
  const pageDescription = isAdmin 
    ? `Managing ${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''}`
    : `Your ${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''}`;

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        {/* Header */}
        <PageHeader
          title={pageTitle}
          description={pageDescription}
        />

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Order Status</label>
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
              <label className="block text-sm font-semibold text-slate-900 mb-2">Payment Status</label>
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
              <p className="text-sm text-slate-500">Use the top search bar to search by order ID, customer, email, or phone.</p>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <OrdersTable orders={filteredOrders} />
      </div>
    </DashboardLayout>
  );
}
