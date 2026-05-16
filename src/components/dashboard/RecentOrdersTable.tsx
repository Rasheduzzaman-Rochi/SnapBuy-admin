'use client';

import Link from 'next/link';
import { Eye } from 'lucide-react';
import { Order } from '@/types/order';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTableWrapper } from '@/components/ui/DataTableWrapper';
import { mockOrders } from '@/data/mockData';

interface RecentOrdersTableProps {
  orders?: Order[];
}

export function RecentOrdersTable({ orders = mockOrders.slice(0, 5) }: RecentOrdersTableProps) {
  const getPaymentBadgeVariant = (status: string): 'success' | 'warning' | 'danger' | 'info' => {
    switch (status) {
      case 'paid':
      case 'paid_test':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'info';
    }
  };

  const getOrderBadgeVariant = (status: string): 'success' | 'warning' | 'danger' | 'info' => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      case 'placed':
        return 'info';
      case 'cancelled':
        return 'danger';
      default:
        return 'info';
    }
  };

  return (
    <DataTableWrapper>
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider hidden sm:table-cell">Customer</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider hidden md:table-cell">Payment</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider hidden lg:table-cell">Date</th>
            <th className="px-6 py-4 text-center text-xs font-bold text-slate-900 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm font-semibold text-slate-900">{order.id}</td>
              <td className="px-6 py-4 text-sm text-slate-600 hidden sm:table-cell">{order.customerName}</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{formatCurrency(order.total)}</td>
              <td className="px-6 py-4 hidden md:table-cell">
                <StatusBadge
                  text={order.paymentStatus === 'paid_test' ? 'Paid (Test)' : order.paymentStatus}
                  variant={getPaymentBadgeVariant(order.paymentStatus)}
                  size="sm"
                />
              </td>
              <td className="px-6 py-4">
                <StatusBadge
                  text={order.orderStatus}
                  variant={getOrderBadgeVariant(order.orderStatus)}
                  size="sm"
                />
              </td>
              <td className="px-6 py-4 text-sm text-slate-600 hidden lg:table-cell">{formatDate(order.createdAt)}</td>
              <td className="px-6 py-4 text-center">
                <Link
                  href={`/orders/${order.id}`}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Eye size={16} />
                  <span className="hidden sm:inline">View</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DataTableWrapper>
  );
}
