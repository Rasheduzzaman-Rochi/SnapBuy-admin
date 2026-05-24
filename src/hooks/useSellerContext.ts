'use client';

import { useEffect, useState } from 'react';
import type { AuthUser, UserRole } from '@/services/authService';
import { getSellerApplication } from '@/services/sellerService';
import type { SellerApplication } from '@/types/seller';
import { getSellerShopName, type SellerContext } from '@/lib/sellerOwnership';

export function useSellerContext(user: AuthUser | null, role: UserRole | null) {
  const [sellerContext, setSellerContext] = useState<SellerContext | null>(null);
  const [sellerProfile, setSellerProfile] = useState<SellerApplication | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role !== 'approved' || !user?.uid) {
      setSellerContext(null);
      setSellerProfile(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    async function loadSellerProfile() {
      try {
        setLoading(true);
        const profile = await getSellerApplication(user.uid);
        const sellerShopName = getSellerShopName(user.email, profile?.shopName);

        console.log('Current seller email:', user.email);
        console.log('Seller shop name:', sellerShopName);

        if (!mounted) return;

        setSellerProfile(profile);
        setSellerContext({
          uid: user.uid,
          email: user.email,
          shopName: sellerShopName,
        });
      } catch (error) {
        const sellerShopName = getSellerShopName(user.email, null);

        console.log('Current seller email:', user.email);
        console.log('Seller shop name:', sellerShopName);

        if (!mounted) return;

        setSellerProfile(null);
        setSellerContext({
          uid: user.uid,
          email: user.email,
          shopName: sellerShopName,
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSellerProfile();

    return () => {
      mounted = false;
    };
  }, [role, user?.email, user?.uid]);

  return { sellerContext, sellerProfile, loading };
}
