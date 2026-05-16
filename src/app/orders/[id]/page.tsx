'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { OrderDetails } from '@/components/orders/OrderDetails';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockOrders } from '@/data/mockData';

interface OrderDetailsPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const order = mockOrders.find((o) => o.id === params.id);

  if (!order) {
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
        <OrderDetails order={order} />
      </div>
    </DashboardLayout>
  );
}
