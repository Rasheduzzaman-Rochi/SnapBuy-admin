'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProductsTable } from '@/components/products/ProductsTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { mockProducts } from '@/data/mockData';
import { useState, useEffect } from 'react';
import { useDashboardSearch } from '@/components/providers/DashboardSearchProvider';
import { useAuth } from '@/hooks/useAuth';

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { query } = useDashboardSearch();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (role === 'approved' && user?.uid) {
      setProducts(mockProducts.filter((p) => p.sellerId === user.uid));
    } else {
      setProducts(mockProducts);
    }
  }, [role, user?.uid]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[50vh] items-center justify-center text-slate-600 dark:text-slate-300">
          Loading products...
        </div>
      </DashboardLayout>
    );
  }

  const categories = ['All', ...new Set(products.map((p) => p.category))];
  const searchTerm = query.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);
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
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Category</label>
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
              <p className="text-sm text-slate-500">Use the top search bar to search by product name or category.</p>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <ProductsTable products={filteredProducts} />
      </div>
    </DashboardLayout>
  );
}
