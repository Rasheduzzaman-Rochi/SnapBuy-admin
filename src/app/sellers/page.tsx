'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SellerApplicationsTable } from '@/components/sellers/SellerApplicationsTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { AccessDenied } from '@/components/ui/AccessDenied';
import { mockSellerApplications } from '@/data/mockData';
import { getCurrentMockRole } from '@/lib/mockAuth';

export default function SellersPage() {
  const [role, setRole] = useState<'admin' | 'seller' | null>(null);

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
            <p className="text-slate-600 mt-4">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show access denied for sellers
  if (role !== 'admin') {
    return (
      <DashboardLayout>
        <AccessDenied />
      </DashboardLayout>
    );
  }

  const pendingCount = mockSellerApplications.filter((a) => a.status === 'pending').length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <PageHeader
          title="Seller Applications"
          description={`${pendingCount} pending review${pendingCount !== 1 ? 's' : ''}`}
        />

        {/* Applications Table */}
        <SellerApplicationsTable applications={mockSellerApplications} />
      </div>
    </DashboardLayout>
  );
}
