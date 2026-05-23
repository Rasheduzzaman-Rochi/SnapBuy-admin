'use client';

import { useState } from 'react';
import { Order } from '@/types/order';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FormSection } from '@/components/ui/FormSection';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTableWrapper } from '@/components/ui/DataTableWrapper';
import { ActionButton } from '@/components/ui/ActionButton';
import { MapPin, Phone, Mail, Package, TrendingUp } from 'lucide-react';
import { ProductImage } from '@/components/products/ProductImage';

interface OrderDetailsProps {
  order: Order;
  onUpdateStatus?: (status: Order['orderStatus']) => Promise<void>;
}

const orderStatuses = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

export function OrderDetails({ order: initialOrder, onUpdateStatus }: OrderDetailsProps) {
  const [order, setOrder] = useState(initialOrder);
  const [selectedStatus, setSelectedStatus] = useState(order.orderStatus);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'info' => {
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

  const getPaymentVariant = (status: string): 'success' | 'warning' | 'danger' => {
    switch (status) {
      case 'paid':
      case 'paid_test':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'warning';
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);
      setError(null);
      await onUpdateStatus?.(selectedStatus as Order['orderStatus']);
      setOrder({ ...order, orderStatus: selectedStatus as Order['orderStatus'] });
    } catch (err: any) {
      setError(err?.message || 'Failed to update order status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Order Header Card */}
      <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl border border-slate-200 p-6 lg:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">Order {order.id}</h1>
            <p className="text-slate-600 mt-2">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <StatusBadge
            text={order.orderStatus}
            variant={getStatusVariant(order.orderStatus)}
            size="md"
          />
        </div>

        {/* Order Status Pills */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-6 border-t border-slate-200">
          <div>
            <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold">Payment Status</p>
            <StatusBadge
              text={order.paymentStatus === 'paid_test' ? 'Paid (Test)' : order.paymentStatus}
              variant={getPaymentVariant(order.paymentStatus)}
              size="sm"
              className="mt-2"
            />
          </div>
          <div>
            <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold">Total Amount</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(order.total)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold">Items</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{order.items.length}</p>
          </div>
        </div>
      </div>

      {/* Customer & Address */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FormSection
          title="Customer Information"
          description="Shipping and contact details"
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-600">Full Name</label>
              <p className="text-lg font-semibold text-slate-900 mt-1">{order.customerName}</p>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
              <Mail size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-600">Email</label>
                <p className="text-slate-900 font-medium mt-0.5">{order.customerEmail}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
              <Phone size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-600">Phone</label>
                <p className="text-slate-900 font-medium mt-0.5">{order.customerPhone}</p>
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Shipping Address"
          description="Delivery location"
        >
          <div className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl">
            <MapPin size={24} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900 text-lg">{order.customerAddress}</p>
              <p className="text-slate-600 text-sm mt-2">This is the delivery address for this order</p>
            </div>
          </div>
        </FormSection>
      </div>

      {/* Order Items */}
      <FormSection
        title="Order Items"
        description={`${order.items.length} item${order.items.length !== 1 ? 's' : ''} in this order`}
      >
        <DataTableWrapper>
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider hidden sm:table-cell">Price</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-900 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {order.items.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.imageUrl ? (
                        <ProductImage imageUrl={item.imageUrl} alt={item.productName} className="h-14 w-14 border border-slate-200 dark:border-slate-700" />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                          <Package size={20} className="text-slate-400" />
                        </div>
                      )}
                      <p className="font-semibold text-slate-900">{item.productName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 hidden sm:table-cell">{formatCurrency(item.price)}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{item.quantity}</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTableWrapper>
      </FormSection>

      {/* Order Summary & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <FormSection
          title="Order Summary"
          description="Pricing breakdown"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-semibold text-slate-900">{formatCurrency(order.total * 0.95)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
              <span className="text-slate-600">Shipping</span>
              <span className="font-semibold text-emerald-600">Free</span>
            </div>
            <div className="flex items-center justify-between p-4 border-t-2 border-slate-200 pt-4 mt-4">
              <span className="font-bold text-slate-900 text-lg">Total Amount</span>
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </FormSection>

        {/* Update Status */}
        <FormSection
          title="Update Order Status"
          description="Change the order processing status"
        >
          <div className="space-y-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="select-field w-full"
            >
              {orderStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <ActionButton
              variant="primary"
              size="md"
              icon={<TrendingUp size={18} />}
              onClick={handleUpdateStatus}
              className="w-full"
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Update Status'}
            </ActionButton>
            {error && (
              <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p>
            )}
          </div>
        </FormSection>
      </div>
    </div>
  );
}
