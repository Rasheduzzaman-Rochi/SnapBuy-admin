'use client';

import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTableWrapper } from '@/components/ui/DataTableWrapper';
import { EmptyState } from '@/components/ui/EmptyState';
import { Package } from 'lucide-react';

interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200">
        <EmptyState
          icon={<Package size={48} />}
          title="No products found"
          description="Try adjusting your search or filters to find what you're looking for."
          action={{
            label: 'Add First Product',
            onClick: () => {
              window.location.href = '/products/add';
            },
          }}
        />
      </div>
    );
  }

  const getStockBadgeVariant = (stock: number): 'success' | 'warning' | 'danger' => {
    if (stock === 0) return 'danger';
    if (stock < 10) return 'warning';
    return 'success';
  };

  const getStockLabel = (stock: number) => {
    if (stock === 0) return `Out of stock`;
    if (stock < 10) return `${stock} left`;
    return `${stock} in stock`;
  };

  return (
    <DataTableWrapper>
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Product</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider hidden sm:table-cell">Category</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Price</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider hidden md:table-cell">Stock</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider hidden lg:table-cell">Status</th>
            <th className="px-6 py-4 text-center text-xs font-bold text-slate-900 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-sm">{product.name}</p>
                    <p className="text-xs text-slate-500 sm:hidden">{product.category}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600 hidden sm:table-cell">{product.category}</td>
              <td className="px-6 py-4 text-sm font-semibold text-slate-900">{formatCurrency(product.price)}</td>
              <td className="px-6 py-4 hidden md:table-cell">
                <StatusBadge
                  text={getStockLabel(product.stock)}
                  variant={getStockBadgeVariant(product.stock)}
                  size="sm"
                />
              </td>
              <td className="px-6 py-4 hidden lg:table-cell">
                <StatusBadge
                  text={product.isActive ? 'Active' : 'Inactive'}
                  variant={product.isActive ? 'success' : 'default'}
                  size="sm"
                />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-1">
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                    title="Edit product"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                    title="Delete product"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DataTableWrapper>
  );
}
