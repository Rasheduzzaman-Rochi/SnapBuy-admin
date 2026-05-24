'use client';

import dynamic from 'next/dynamic';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { AccessDenied } from '@/components/ui/AccessDenied';
import { useDashboardSearch } from '@/components/providers/DashboardSearchProvider';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getAllUsers } from '@/services/userService';
import { User } from '@/types/user';

const UsersTable = dynamic(
  () => import('@/components/users/UsersTable').then((mod) => mod.UsersTable),
  {
    loading: () => (
      <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900" />
    ),
  }
);

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { query } = useDashboardSearch();
  const { user, role, loading } = useAuth();
  const uid = user?.uid;
  const fetchKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (loading || role !== 'admin') return;
    if (!uid) return;

    const fetchKey = `admin:${uid}`;
    if (fetchKeyRef.current === fetchKey) return;
    fetchKeyRef.current = fetchKey;

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
  }, [loading, role, uid]);

  const filteredUsers = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    return users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.phone.toLowerCase().includes(searchTerm)
    );
  }, [query, users]);

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

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-6">
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
