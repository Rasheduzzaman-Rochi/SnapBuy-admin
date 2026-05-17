'use client';

import { Shield, Store } from 'lucide-react';

type DashboardRole = 'admin' | 'seller';

interface RoleBadgeProps {
  role: DashboardRole;
  size?: 'sm' | 'md';
}

export function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
  const isAdmin = role === 'admin';
  const label = isAdmin ? 'Admin' : 'Seller';
  const baseClass = isAdmin
    ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300';
  
  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
        baseClass
      }`}>
        {isAdmin ? <Shield size={12} /> : <Store size={12} />}
        {label}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
      baseClass
    }`}>
      {isAdmin ? <Shield size={20} /> : <Store size={20} />}
      {label}
    </div>
  );
}
