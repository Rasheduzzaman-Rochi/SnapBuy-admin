'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { AdminSettings } from '@/components/settings/AdminSettings';
import { SellerSettings } from '@/components/settings/SellerSettings';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsPage() {
  const { user, role, adminProfile, sellerProfile, loading } = useAuth();

  // Show loading state while checking role
  if (loading || !role) {
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
      <div className="mx-auto w-full max-w-4xl space-y-6">
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
