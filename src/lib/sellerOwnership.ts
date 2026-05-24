import type { Order } from '@/types/order';
import type { Product } from '@/types/product';

const LEGACY_SNAPBUY_STORE_EMAIL = 'rasheduzzaman.rochi.iub@gmail.com';
const LEGACY_SNAPBUY_STORE_NAME = 'SnapBuy Store';

export interface SellerContext {
  uid: string;
  email?: string | null;
  shopName?: string | null;
}

export function normalizeText(value?: string | null): string {
  return (value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getSellerShopName(email?: string | null, profileShopName?: string | null): string {
  const normalizedProfileShopName = profileShopName?.trim();

  if (normalizedProfileShopName) {
    return normalizedProfileShopName;
  }

  // Legacy migration support: old products were created for this shop by name
  // before sellerId ownership was consistently stored.
  if (normalizeText(email) === normalizeText(LEGACY_SNAPBUY_STORE_EMAIL)) {
    return LEGACY_SNAPBUY_STORE_NAME;
  }

  return '';
}

export function productBelongsToSeller(product: Product, sellerContext: SellerContext): boolean {
  const sellerShopName = normalizeText(sellerContext.shopName);

  if (product.sellerId && product.sellerId === sellerContext.uid) {
    return true;
  }

  if (!sellerShopName) {
    return false;
  }

  return (
    normalizeText(product.sellerName) === sellerShopName ||
    normalizeText(product.shopName) === sellerShopName
  );
}

export function orderBelongsToSeller(order: Order, sellerContext: SellerContext): boolean {
  const sellerShopName = normalizeText(sellerContext.shopName);

  if (order.sellerIds?.includes(sellerContext.uid) || order.sellerId === sellerContext.uid) {
    return true;
  }

  return order.items.some((item) => {
    if (item.sellerId === sellerContext.uid) {
      return true;
    }

    if (!sellerShopName) {
      return false;
    }

    return (
      normalizeText(item.sellerName) === sellerShopName ||
      normalizeText(item.shopName) === sellerShopName
    );
  });
}
