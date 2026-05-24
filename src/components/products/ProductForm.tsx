'use client';

import { useState } from 'react';
import { ImageIcon, Info, Link2, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { FormSection } from '@/components/ui/FormSection';
import { ActionButton } from '@/components/ui/ActionButton';
import { addProduct } from '@/services/productService';
import { useAuth } from '@/hooks/useAuth';
import { useSellerContext } from '@/hooks/useSellerContext';
import { ProductImage } from '@/components/products/ProductImage';
import { isGoogleDriveImageUrl } from '@/lib/imageUtils';

interface ProductFormProps {
  initialData?: Product;
  isEditing?: boolean;
  onSubmit?: (data: Partial<Product>) => Promise<void> | void;
}

const categories = ['Electronics', 'Bags', 'Shoes', 'Accessories', 'Clothing', 'Books', 'Other'];

export function ProductForm({ initialData, isEditing = false, onSubmit }: ProductFormProps) {
  const router = useRouter();
  const { user, role } = useAuth();
  const { sellerContext } = useSellerContext(user, role);
  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || {
      name: '',
      description: '',
      category: '',
      price: 0,
      stock: 0,
      isActive: true,
      isFeatured: false,
    }
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);
      setImageError(null);

      const imageUrl = formData.imageUrl?.trim() ?? '';

      if (!imageUrl || !isGoogleDriveImageUrl(imageUrl)) {
        setImageError('Please enter a valid Google Drive image link.');
        return;
      }

      const productData = {
        ...formData,
        imageUrl,
        price: Number(formData.price ?? 0),
        stock: Number(formData.stock ?? 0),
      };

      if (onSubmit) {
        await onSubmit(productData);
      } else {
        const result = await addProduct({
          name: productData.name ?? '',
          description: productData.description ?? '',
          category: productData.category ?? '',
          price: productData.price ?? 0,
          stock: productData.stock ?? 0,
          imageUrl,
          sellerId: user?.uid ?? '',
          sellerName: sellerContext?.shopName || user?.displayName || user?.email || '',
          shopName: sellerContext?.shopName || user?.displayName || user?.email || '',
          sellerEmail: user?.email ?? '',
          isActive: productData.isActive ?? true,
          isFeatured: productData.isFeatured ?? false,
        });

        if (!result.success) {
          throw new Error(result.error || 'Failed to create product.');
        }
      }

      router.push('/products');
    } catch (err: any) {
      setError(err?.message || `Failed to ${isEditing ? 'update' : 'create'} product.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : type === 'number' ? Number(value) : value,
    });
  };

  const handleCancel = () => {
    router.push('/products');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Product Image Section */}
      <FormSection
        title="Product Image"
        description="Add a Google Drive image link and preview it before saving"
      >
        <div className="space-y-5">
          <div>
            <label htmlFor="imageUrl" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <Link2 size={16} className="text-blue-600 dark:text-blue-300" />
              Google Drive Image URL *
            </label>
            <input
              id="imageUrl"
              type="url"
              name="imageUrl"
              value={formData.imageUrl || ''}
              onChange={(event) => {
                handleChange(event);
                if (imageError) setImageError(null);
              }}
              required
              placeholder="Paste Google Drive share link here"
              className="input-field w-full"
            />
            {imageError && (
              <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-300">{imageError}</p>
            )}
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
            <div className="flex items-start gap-3">
              <Info size={18} className="mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-300" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Only Google Drive image links are supported for now. Make sure the file is shared as "Anyone with the link can view".
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-200">
                  The image file remains in your Google Drive; SnapBuy only stores the link.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
            {formData.imageUrl?.trim() ? (
              <ProductImage
                imageUrl={formData.imageUrl}
                alt={formData.name || 'Product image preview'}
                className="h-64 w-full rounded-none"
              />
            ) : (
              <div className="flex h-64 flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500">
                <ImageIcon size={42} />
                <p className="text-sm font-medium">Image preview will appear here</p>
              </div>
            )}
          </div>
        </div>
      </FormSection>

      {/* Product Information Section */}
      <FormSection
        title="Product Information"
        description="Basic details about your product"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
              className="input-field w-full"
              placeholder="e.g., Premium Wireless Headphones"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              required
              className="textarea-field w-full"
              placeholder="Describe your product features and benefits..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Category *</label>
              <select
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                required
                className="select-field w-full"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Pricing & Inventory Section */}
      <FormSection
        title="Pricing & Inventory"
        description="Set your product price and stock levels"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Price (BDT) *</label>
            <input
              type="number"
              name="price"
              value={formData.price || ''}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="input-field w-full"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Stock Quantity *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock || ''}
              onChange={handleChange}
              required
              min="0"
              className="input-field w-full"
              placeholder="0"
            />
          </div>
        </div>
      </FormSection>

      {/* Product Status Section */}
      <FormSection
        title="Product Status"
        description="Control product visibility and featured status"
      >
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive || false}
              onChange={handleChange}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <div>
              <p className="font-semibold text-slate-900">Active Status</p>
              <p className="text-xs text-slate-600">Make this product visible in the store</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured || false}
              onChange={handleChange}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <div>
              <p className="font-semibold text-slate-900">Featured Product</p>
              <p className="text-xs text-slate-600">Highlight this product on the homepage</p>
            </div>
          </label>
        </div>
      </FormSection>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <ActionButton
          type="submit"
          variant="primary"
          size="md"
          icon={<Save size={18} />}
          className="flex-1"
          isLoading={submitting}
        >
          {isEditing ? 'Update Product' : 'Save Product'}
        </ActionButton>
        <ActionButton
          type="button"
          variant="secondary"
          size="md"
          icon={<X size={18} />}
          onClick={handleCancel}
          className="flex-1"
        >
          Cancel
        </ActionButton>
      </div>
    </form>
  );
}
