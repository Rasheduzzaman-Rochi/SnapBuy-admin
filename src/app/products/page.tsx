'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProductsTable } from '@/components/products/ProductsTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { useState, useEffect } from 'react';
import { useDashboardSearch } from '@/components/providers/DashboardSearchProvider';
import { useAuth } from '@/hooks/useAuth';
import { useSellerContext } from '@/hooks/useSellerContext';
import { getProducts } from '@/services/productService';
import { Product } from '@/types/product';
import { AccessDenied } from '@/components/ui/AccessDenied';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { query } = useDashboardSearch();
  const { user, role, loading } = useAuth();
  const { sellerContext, loading: sellerContextLoading } = useSellerContext(user, role);

  useEffect(() => {
    if (loading || sellerContextLoading || !role) return;

    if (role !== 'admin' && role !== 'approved') {
      setProducts([]);
      return;
    }

    let mounted = true;

    async function loadProducts() {
      try {
        setDataLoading(true);
        setError(null);
        const products = await getProducts(role, user?.uid, sellerContext);
        if (role === 'approved') {
          console.log('Filtered seller products count:', products.length);
        }
        if (mounted) setProducts(products);
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Failed to load products.');
      } finally {
        if (mounted) setDataLoading(false);
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [loading, role, sellerContext, sellerContextLoading, user?.uid]);

  if (loading || sellerContextLoading || dataLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[50vh] items-center justify-center text-slate-600 dark:text-slate-300">
          Loading products...
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

  const categories = ['All', ...new Set(products.map((p) => p.category))];
  const searchTerm = query.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.sellerName.toLowerCase().includes(searchTerm) ||
      (product.shopName ?? '').toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isAdmin = role === 'admin';
  const pageTitle = isAdmin ? 'All Products' : 'My Products';
  const pageDescription = isAdmin 
    ? `Manage all ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
    : `Manage your ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`;

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        {/* Header */}
        <PageHeader
          title={pageTitle}
          description={pageDescription}
          action={
            <Link href="/products/add">
              <ActionButton variant="primary" icon={<Plus size={20} />}>
                Add Product
              </ActionButton>
            </Link>
          }
        />

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2 dark:text-slate-100">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select-field w-full"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <p className="text-sm text-slate-500 dark:text-slate-400">Use the top search bar to search by product name, category, or seller.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Products Table */}
        <ProductsTable products={filteredProducts} />
      </div>
    </DashboardLayout>
  );
}
