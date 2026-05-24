'use client';

import { use, useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProductForm } from '@/components/products/ProductForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { AccessDenied } from '@/components/ui/AccessDenied';
import { getProductById, updateProduct } from '@/services/productService';
import { useAuth } from '@/hooks/useAuth';
import { useSellerContext } from '@/hooks/useSellerContext';
import { productBelongsToSeller } from '@/lib/sellerOwnership';
import { Product } from '@/types/product';

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const { user, role, loading } = useAuth();
  const { sellerContext, loading: sellerContextLoading } = useSellerContext(user, role);
  const [product, setProduct] = useState<Product | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uid = user?.uid;
  const email = user?.email;
  const sellerShopName = sellerContext?.shopName ?? '';
  const fetchKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (loading || sellerContextLoading || !role) return;

    if (role !== 'admin' && role !== 'approved') {
      setAccessDenied(true);
      return;
    }

    if (role === 'approved' && !uid) return;

    const fetchKey = `${id}:${role}:${uid ?? 'admin'}:${sellerShopName}`;
    if (fetchKeyRef.current === fetchKey) return;
    fetchKeyRef.current = fetchKey;

    let mounted = true;

    async function loadProduct() {
      try {
        setDataLoading(true);
        setError(null);
        setNotFound(false);
        setAccessDenied(false);

        const loadedProduct = await getProductById(id);

        if (!mounted) return;

        if (!loadedProduct) {
          setNotFound(true);
          setProduct(null);
          return;
        }

        const sellerLookupContext = role === 'approved'
          ? { uid: uid ?? '', email, shopName: sellerShopName }
          : null;

        if (role !== 'admin' && (!sellerLookupContext || !productBelongsToSeller(loadedProduct, sellerLookupContext))) {
          setAccessDenied(true);
          setProduct(null);
          return;
        }

        setProduct(loadedProduct);
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Failed to load product.');
      } finally {
        if (mounted) setDataLoading(false);
      }
    }

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [email, id, loading, role, sellerContextLoading, sellerShopName, uid]);

  const handleSubmit = async (data: Partial<Product>) => {
    const result = await updateProduct(id, data);
    if (!result.success) {
      throw new Error(result.error || 'Failed to update product.');
    }
  };

  if (loading || sellerContextLoading || dataLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[50vh] items-center justify-center text-slate-600 dark:text-slate-300">
          Loading product...
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

  if (notFound || !product) {
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
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header */}
        <PageHeader
          title="Edit Product"
          description={`Update information for ${product.name}`}
        />

        {/* Form */}
        <ProductForm initialData={product} isEditing onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
}
