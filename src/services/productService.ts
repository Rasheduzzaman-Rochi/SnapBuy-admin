/**
 * Products Service
 * Handles product operations with Firestore
 */

'use client';

import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types/product';
import { UserRole } from './authService';
import { toMillis } from '@/lib/utils';
import { productBelongsToSeller, type SellerContext } from '@/lib/sellerOwnership';

function mapProduct(docId: string, data: any): Product {
  return {
    id: docId,
    name: data.name ?? '',
    description: data.description ?? '',
    category: data.category ?? 'Other',
    price: Number(data.price ?? 0),
    imageUrl: data.imageUrl || data.imageURL || data.image || data.photoUrl || '',
    stock: Number(data.stock ?? 0),
    sellerId: data.sellerId ?? '',
    sellerName: data.sellerName ?? '',
    shopName: data.shopName ?? data.storeName ?? '',
    sellerEmail: data.sellerEmail ?? '',
    isActive: data.isActive ?? true,
    isFeatured: data.isFeatured ?? false,
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
}

/**
 * Get products based on role and user ID
 * - admin: get all products
 * - seller: get products where sellerId == uid
 */
export async function getProducts(role: UserRole, uid?: string, sellerContext?: SellerContext | null): Promise<Product[]> {
  try {
    if (role !== 'admin' && !uid) {
      return [];
    }

    const productsRef = collection(db, 'products');
    const q = query(productsRef);

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push(mapProduct(doc.id, doc.data()));
    });

    const visibleProducts = role === 'admin'
      ? products
      : products.filter((product) => productBelongsToSeller(product, sellerContext ?? { uid: uid ?? '' }));

    visibleProducts.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));

    return visibleProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Get single product by ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
  if (!productId || typeof productId !== 'string') {
    console.error('Invalid productId passed to getProductById:', productId);
    return null;
  }

  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return mapProduct(docSnap.id, docSnap.data());
    }

    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

/**
 * Add new product
 */
export async function addProduct(
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
) {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      imageUrl: productData.imageUrl.trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      id: docRef.id,
    };
  } catch (error: any) {
    console.error('Error adding product:', error);
    return {
      success: false,
      error: error.message || 'Failed to add product',
    };
  }
}

/**
 * Update product
 */
export async function updateProduct(
  productId: string,
  productData: Partial<Product>
) {
  try {
    let updateData = { ...productData };

    if (typeof updateData.imageUrl === 'string') {
      updateData.imageUrl = updateData.imageUrl.trim();
    }

    // Always update updatedAt
    updateData.updatedAt = serverTimestamp() as any;

    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, updateData);

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return {
      success: false,
      error: error.message || 'Failed to update product',
    };
  }
}

/**
 * Delete product
 */
export async function deleteProduct(productId: string) {
  try {
    await deleteDoc(doc(db, 'products', productId));
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete product',
    };
  }
}
