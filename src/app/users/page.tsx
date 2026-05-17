'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UsersTable } from '@/components/users/UsersTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { AccessDenied } from '@/components/ui/AccessDenied';
import { mockUsers } from '@/data/mockData';
import { getCurrentMockRole } from '@/lib/mockAuth';

export default function UsersPage() {
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

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        {/* Header */}
        <PageHeader
          title="Users"
          description={`${mockUsers.length} registered customer${mockUsers.length !== 1 ? 's' : ''}`}
        />

        {/* Users Table */}
        <UsersTable users={mockUsers} />
      </div>
    </DashboardLayout>
  );
}
