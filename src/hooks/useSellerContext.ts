'use client';

import type { AuthUser, UserRole } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';

export function useSellerContext(_user?: AuthUser | null, _role?: UserRole | null) {
  const { sellerContext, sellerProfile, loading } = useAuth();

  return { sellerContext, sellerProfile, loading };
}
