'use client';

import { SellerApplication } from '@/types/seller';
import { formatDate } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTableWrapper } from '@/components/ui/DataTableWrapper';
import { ActionButton } from '@/components/ui/ActionButton';
import { EmptyState } from '@/components/ui/EmptyState';

interface SellerApplicationsTableProps {
  applications: SellerApplication[];
  onApprove?: (uid: string) => Promise<void> | void;
  onReject?: (uid: string) => Promise<void> | void;
  adminUid?: string;
}

export function SellerApplicationsTable({ applications, onApprove, onReject }: SellerApplicationsTableProps) {
  if (applications.length === 0) {
    return (
      <EmptyState
        title="No seller applications found"
        description="Try adjusting your search to find matching seller applications."
      />
    );
  }

  const getStatusVariant = (status: string): 'success' | 'danger' | 'warning' | 'info' => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <DataTableWrapper>
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider dark:text-slate-100">Shop Name</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider hidden sm:table-cell dark:text-slate-100">Owner</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider hidden md:table-cell dark:text-slate-100">Category</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider dark:text-slate-100">Status</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider hidden lg:table-cell dark:text-slate-100">Date</th>
            <th className="px-6 py-4 text-center text-xs font-bold text-slate-900 uppercase tracking-wider dark:text-slate-100">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {applications.map((app) => {
            const status = (app.status || 'pending').toString().toLowerCase();
            return (
              <tr key={app.uid} className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-800/60">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{app.shopName}</p>
                    <p className="text-xs text-slate-500 sm:hidden dark:text-slate-400">{app.ownerName}</p>
                    <p className="text-xs text-slate-500 sm:hidden dark:text-slate-400">{app.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 hidden sm:table-cell dark:text-slate-400">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{app.ownerName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{app.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 hidden md:table-cell dark:text-slate-400">{app.category}</td>
                <td className="px-6 py-4">
                  <StatusBadge
                    text={status.charAt(0).toUpperCase() + status.slice(1)}
                    variant={getStatusVariant(status)}
                    size="sm"
                  />
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 hidden lg:table-cell dark:text-slate-400">{formatDate(app.createdAt)}</td>
                <td className="px-6 py-4">
                  {status === 'pending' && (
                    <div className="flex items-center justify-center gap-2">
                      <ActionButton
                        variant="primary"
                        size="sm"
                        icon={<Check size={16} />}
                        title="Approve"
                        onClick={() => onApprove && onApprove(app.uid)}
                      >
                        <span className="hidden sm:inline">Approve</span>
                      </ActionButton>
                      <ActionButton
                        variant="danger"
                        size="sm"
                        icon={<X size={16} />}
                        title="Reject"
                        onClick={() => onReject && onReject(app.uid)}
                      >
                        <span className="hidden sm:inline">Reject</span>
                      </ActionButton>
                    </div>
                  )}
                  {status !== 'pending' && (
                    <span className="text-xs text-slate-500 font-medium dark:text-slate-400">
                      {status === 'approved' ? '✓ Approved' : '✕ Rejected'}
                    </span>
                  )}
                </td>
              </tr>
          );
          })}
        </tbody>
      </table>
    </DataTableWrapper>
  );
}
