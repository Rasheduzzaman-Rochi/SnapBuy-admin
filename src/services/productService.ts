/**
 * Products Service
 * Handles product operations with Firestore
 */

'use client';

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Product } from '@/types/product';
import { UserRole } from './authService';

/**
 * Get products based on role and user ID
 * - admin: get all products
 * - seller: get products where sellerId == uid
 */
export async function getProducts(role: UserRole, uid?: string): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products');
    let q;

    if (role === 'admin') {
      q = query(productsRef);
    } else {
      // Seller: only their products
      q = query(productsRef, where('sellerId', '==', uid));
    }

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...(doc.data() as Omit<Product, 'id'>),
      } as Product);
    });

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Get single product by ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...(docSnap.data() as Omit<Product, 'id'>),
      } as Product;
    }

    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Add new product
 */
export async function addProduct(
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  imageFile?: File
) {
  try {
    let imageUrl = productData.imageUrl;

    // Upload image if provided
    if (imageFile) {
      imageUrl = await uploadProductImage(imageFile);
    }

    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      imageUrl,
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
  productData: Partial<Product>,
  imageFile?: File
) {
  try {
    let updateData = { ...productData };

    // Upload new image if provided
    if (imageFile) {
      const imageUrl = await uploadProductImage(imageFile);
      updateData.imageUrl = imageUrl;
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

/**
 * Upload product image to Firebase Storage
 */
export async function uploadProductImage(file: File): Promise<string> {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `products/${fileName}`);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
}
