'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UsersTable } from '@/components/users/UsersTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { AccessDenied } from '@/components/ui/AccessDenied';
import { useDashboardSearch } from '@/components/providers/DashboardSearchProvider';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { getAllUsers } from '@/services/userService';
import { User } from '@/types/user';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { query } = useDashboardSearch();
  const { role, loading } = useAuth();

  useEffect(() => {
    if (loading || role !== 'admin') return;

    let mounted = true;

    async function loadUsers() {
      try {
        setDataLoading(true);
        setError(null);
        const users = await getAllUsers();
        if (mounted) setUsers(users);
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Failed to load users.');
      } finally {
        if (mounted) setDataLoading(false);
      }
    }

    loadUsers();

    return () => {
      mounted = false;
    };
  }, [loading, role]);

  if (loading || dataLoading) {
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
  const filteredUsers = users.filter((user) =>
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

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Users Table */}
        <UsersTable users={filteredUsers} />
      </div>
    </DashboardLayout>
  );
}
