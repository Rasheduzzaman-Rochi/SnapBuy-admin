import type { DateValue } from './common';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  stock: number;
  sellerId: string;
  sellerName: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: DateValue;
  updatedAt: DateValue;
}
