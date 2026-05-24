'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { AdminSettings } from '@/components/settings/AdminSettings';
import { SellerSettings } from '@/components/settings/SellerSettings';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { getAdminProfile, type AdminProfile } from '@/services/authService';
import { getSellerApplication } from '@/services/sellerService';
import type { SellerApplication } from '@/types/seller';
import { getSellerShopName } from '@/lib/sellerOwnership';

export default function SettingsPage() {
  const { user, role, loading } = useAuth();
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [sellerProfile, setSellerProfile] = useState<SellerApplication | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (loading || !role || !user?.uid) return;

    let mounted = true;

    async function loadProfile() {
      try {
        setProfileLoading(true);

        if (role === 'admin') {
          const profile = await getAdminProfile(user.uid);
          if (mounted) setAdminProfile(profile);
          return;
        }

        if (role === 'approved') {
          const profile = await getSellerApplication(user.uid);
          if (!mounted) return;

          setSellerProfile(profile ? {
            ...profile,
            shopName: getSellerShopName(user.email, profile.shopName),
          } : {
            uid: user.uid,
            email: user.email ?? '',
            ownerName: '',
            shopName: getSellerShopName(user.email, null),
            phone: '',
            address: '',
            category: '',
            status: 'approved',
            createdAt: null,
          });
        }
      } catch (error) {
        if (!mounted || role !== 'approved') return;

        setSellerProfile({
          uid: user.uid,
          email: user.email ?? '',
          ownerName: '',
          shopName: getSellerShopName(user.email, null),
          phone: '',
          address: '',
          category: '',
          status: 'approved',
          createdAt: null,
        });
      } finally {
        if (mounted) setProfileLoading(false);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [loading, role, user?.email, user?.uid]);

  // Show loading state while checking role
  if (loading || profileLoading || !role) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[50vh] items-center justify-center text-slate-600 dark:text-slate-300">
          Loading settings...
        </div>
      </DashboardLayout>
    );
  }

  const isAdmin = role === 'admin';
  const pageTitle = isAdmin ? 'Admin Settings' : 'Seller Settings';
  const pageDescription = isAdmin 
    ? 'Manage your admin profile and platform preferences'
    : 'Manage your seller profile and shop information';

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-4xl space-y-8">
        {/* Header */}
        <PageHeader
          title={pageTitle}
          description={pageDescription}
        />

        {/* Role-Based Settings */}
        {isAdmin ? (
          <AdminSettings user={user} adminProfile={adminProfile} />
        ) : (
          <SellerSettings user={user} sellerProfile={sellerProfile} />
        )}
      </div>
    </DashboardLayout>
  );
}
