'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UsersTable } from '@/components/users/UsersTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { AccessDenied } from '@/components/ui/AccessDenied';
import { mockUsers } from '@/data/mockData';
import { useDashboardSearch } from '@/components/providers/DashboardSearchProvider';
import { useAuth } from '@/hooks/useAuth';

export default function UsersPage() {
  const { query } = useDashboardSearch();
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[50vh] items-center justify-center text-slate-600 dark:text-slate-300">
          Loading users...
        </div>
      </DashboardLayout>
    );
  }

  // Show loading state while checking role
  if (role !== 'admin') {
    return (
      <DashboardLayout>
        <AccessDenied />
      </DashboardLayout>
    );
  }

  const searchTerm = query.trim().toLowerCase();
  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm) ||
    user.phone.toLowerCase().includes(searchTerm)
  );

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        {/* Header */}
        <PageHeader
          title="Users"
          description={`${filteredUsers.length} registered customer${filteredUsers.length !== 1 ? 's' : ''}`}
        />

        {/* Users Table */}
        <UsersTable users={filteredUsers} />
      </div>
    </DashboardLayout>
  );
}
