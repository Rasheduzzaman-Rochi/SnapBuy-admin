'use client';

import { User } from '@/types/user';
import { formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTableWrapper } from '@/components/ui/DataTableWrapper';
import { EmptyState } from '@/components/ui/EmptyState';

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  if (users.length === 0) {
    return (
      <EmptyState
        title="No users found"
        description="Try adjusting your search to find matching users."
      />
    );
  }

  const getStatusVariant = (status: string): 'success' | 'danger' | 'warning' | 'info' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'suspended':
        return 'danger';
      default:
        return 'info';
    }
  };

  return (
    <DataTableWrapper>
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider dark:text-slate-100">Name</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider hidden sm:table-cell dark:text-slate-100">Email</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider hidden md:table-cell dark:text-slate-100">Phone</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider hidden lg:table-cell dark:text-slate-100">Provider</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider dark:text-slate-100">Joined</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider dark:text-slate-100">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {users.map((user) => (
            <tr key={user.uid} className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-800/60">
              <td className="px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                  <p className="text-xs text-slate-500 sm:hidden dark:text-slate-400">{user.email}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600 hidden sm:table-cell dark:text-slate-400">{user.email}</td>
              <td className="px-6 py-4 text-sm text-slate-600 hidden md:table-cell dark:text-slate-400">{user.phone}</td>
              <td className="px-6 py-4 text-sm text-slate-600 hidden lg:table-cell capitalize dark:text-slate-400">{user.provider}</td>
              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{formatDate(user.createdAt)}</td>
              <td className="px-6 py-4">
                <StatusBadge
                  text={user.status}
                  variant={getStatusVariant(user.status)}
                  size="sm"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DataTableWrapper>
  );
}
