'use client';

import { User } from '@/types/user';
import { formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTableWrapper } from '@/components/ui/DataTableWrapper';

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
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
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Name</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider hidden sm:table-cell">Email</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider hidden md:table-cell">Phone</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider hidden lg:table-cell">Provider</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Joined</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {users.map((user) => (
            <tr key={user.uid} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500 sm:hidden">{user.email}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600 hidden sm:table-cell">{user.email}</td>
              <td className="px-6 py-4 text-sm text-slate-600 hidden md:table-cell">{user.phone}</td>
              <td className="px-6 py-4 text-sm text-slate-600 hidden lg:table-cell capitalize">{user.provider}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{formatDate(user.createdAt)}</td>
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
