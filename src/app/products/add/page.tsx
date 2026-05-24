'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProductForm } from '@/components/products/ProductForm';
import { PageHeader } from '@/components/ui/PageHeader';

export default function AddProductPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header */}
        <PageHeader
          title="Add Product"
          description="Create a new product listing for your store"
        />

        {/* Form */}
        <ProductForm />
      </div>
    </DashboardLayout>
  );
}
