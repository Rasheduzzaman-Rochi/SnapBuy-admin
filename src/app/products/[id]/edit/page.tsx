'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProductForm } from '@/components/products/ProductForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockProducts } from '@/data/mockData';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const product = mockProducts.find((p) => p.id === params.id);

  if (!product) {
    return (
      <DashboardLayout>
        <EmptyState
          icon="📦"
          title="Product Not Found"
          description="The product you're trying to edit doesn't exist. Please check the product ID and try again."
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <PageHeader
          title="Edit Product"
          description={`Update information for ${product.name}`}
        />

        {/* Form */}
        <ProductForm initialData={product} isEditing />
      </div>
    </DashboardLayout>
  );
}
