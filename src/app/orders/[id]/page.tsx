'use client';

import { use, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { OrderDetails } from '@/components/orders/OrderDetails';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { AccessDenied } from '@/components/ui/AccessDenied';
import { getOrderById, updateOrderStatus } from '@/services/orderService';
import { useAuth } from '@/hooks/useAuth';
import { useSellerContext } from '@/hooks/useSellerContext';
import { orderBelongsToSeller } from '@/lib/sellerOwnership';
import { Order } from '@/types/order';

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = use(params);
  const { user, role, loading } = useAuth();
  const { sellerContext, loading: sellerContextLoading } = useSellerContext(user, role);
  const [order, setOrder] = useState<Order | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading || sellerContextLoading || !role) return;

    if (role !== 'admin' && role !== 'approved') {
      setAccessDenied(true);
      return;
    }

    let mounted = true;

    async function loadOrder() {
      try {
        setDataLoading(true);
        setError(null);
        setNotFound(false);
        setAccessDenied(false);

        const loadedOrder = await getOrderById(id);

        if (!mounted) return;

        if (!loadedOrder) {
          setNotFound(true);
          setOrder(null);
          return;
        }

        const sellerCanAccess =
          role === 'approved' &&
          !!sellerContext &&
          orderBelongsToSeller(loadedOrder, sellerContext);

        if (role !== 'admin' && !sellerCanAccess) {
          setAccessDenied(true);
          setOrder(null);
          return;
        }

        setOrder(loadedOrder);
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Failed to load order.');
      } finally {
        if (mounted) setDataLoading(false);
      }
    }

    loadOrder();

    return () => {
      mounted = false;
    };
  }, [id, loading, role, sellerContext, sellerContextLoading]);

  const handleUpdateStatus = async (status: Order['orderStatus']) => {
    const result = await updateOrderStatus(id, status);
    if (!result.success) {
      throw new Error(result.error || 'Failed to update order status.');
    }
    setOrder((current) => (current ? { ...current, orderStatus: status, updatedAt: new Date() } : current));
  };

  if (loading || sellerContextLoading || dataLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[50vh] items-center justify-center text-slate-600 dark:text-slate-300">
          Loading order...
        </div>
      </DashboardLayout>
    );
  }

  if (accessDenied) {
    return (
      <DashboardLayout>
        <AccessDenied />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  if (notFound || !order) {
    return (
      <DashboardLayout>
        <EmptyState
          icon="🔍"
          title="Order Not Found"
          description="The order you're looking for doesn't exist. Check the order ID and try again."
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <PageHeader
          title="Order Details"
          description="View and manage order information"
        />

        {/* Order Details */}
        <OrderDetails order={order} onUpdateStatus={handleUpdateStatus} />
      </div>
    </DashboardLayout>
  );
}
