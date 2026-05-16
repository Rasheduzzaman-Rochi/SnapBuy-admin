'use client';

import Link from 'next/link';
import { Plus, Search as SearchIcon } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProductsTable } from '@/components/products/ProductsTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { mockProducts } from '@/data/mockData';
import { getCurrentMockRole, mockSellerUser } from '@/lib/mockAuth';
import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [role, setRole] = useState<'admin' | 'seller'>('admin');
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const currentRole = getCurrentMockRole();
    setRole(currentRole);
    
    // Filter products based on role
    if (currentRole === 'seller') {
      setProducts(mockProducts.filter(p => p.sellerId === mockSellerUser.uid));
    } else {
      setProducts(mockProducts);
    }
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pageTitle = role === 'admin' ? 'All Products' : 'My Products';
  const pageDescription = role === 'admin' 
    ? `Manage all ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
    : `Manage your ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`;

  return (
    <DashboardLayout>
      <div className="space-y-8">
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
              <label className="block text-sm font-semibold text-slate-900 mb-2">Search Products</label>
              <div className="relative">
                <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-full"
                />
              </div>
            </div>
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
          </div>
        </div>

        {/* Products Table */}
        <ProductsTable products={filteredProducts} />
      </div>
    </DashboardLayout>
  );
}
