'use client';

import { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { mockOrders } from '@/data/mockData';
import { getCurrentMockRole, mockSellerUser } from '@/lib/mockAuth';

export default function OrdersPage() {
  const [role, setRole] = useState<'admin' | 'seller'>('admin');
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderStatus, setOrderStatus] = useState('All');
  const [paymentStatus, setPaymentStatus] = useState('All');

  useEffect(() => {
    const currentRole = getCurrentMockRole();
    setRole(currentRole);
    
    // Filter orders based on role
    if (currentRole === 'seller') {
      setOrders(mockOrders.filter(o => o.sellerId === mockSellerUser.uid));
    } else {
      setOrders(mockOrders);
    }
  }, []);

  const orderStatuses = ['All', 'placed', 'processing', 'shipped', 'delivered', 'cancelled'];
  const paymentStatuses = ['All', 'pending', 'paid_test', 'paid', 'failed'];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrderStatus = orderStatus === 'All' || order.orderStatus === orderStatus;
    const matchesPaymentStatus = paymentStatus === 'All' || order.paymentStatus === paymentStatus;
    return matchesSearch && matchesOrderStatus && matchesPaymentStatus;
  });

  const pageTitle = role === 'admin' ? 'All Orders' : 'My Orders';
  const pageDescription = role === 'admin' 
    ? `Managing ${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''}`
    : `Your ${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''}`;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <PageHeader
          title={pageTitle}
          description={pageDescription}
        />

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Search Orders</label>
              <div className="relative">
                <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Order ID or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-full"
                />
              </div>
            </div>
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
          </div>
        </div>

        {/* Orders Table */}
        <OrdersTable orders={filteredOrders} />
      </div>
    </DashboardLayout>
  );
}
