'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { AdminSettings } from '@/components/settings/AdminSettings';
import { SellerSettings } from '@/components/settings/SellerSettings';
import { getCurrentMockRole, UserRole } from '@/lib/mockAuth';

export default function SettingsPage() {
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    setRole(getCurrentMockRole());
  }, []);

  // Show loading state while checking role
  if (role === null) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-600 mt-4">Loading settings...</p>
          </div>
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
        {isAdmin ? <AdminSettings /> : <SellerSettings />}
      </div>
    </DashboardLayout>
  );
}
