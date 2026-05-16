'use client';

import { Shield, Store } from 'lucide-react';
import { UserRole } from '@/lib/mockAuth';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md';
}

export function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
  const isAdmin = role === 'admin';
  
  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
        isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
      }`}>
        {isAdmin ? <Shield size={12} /> : <Store size={12} />}
        {isAdmin ? 'Admin' : 'Seller'}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
      isAdmin 
        ? 'bg-blue-100 text-blue-700' 
        : 'bg-emerald-100 text-emerald-700'
    }`}>
      {isAdmin ? <Shield size={20} /> : <Store size={20} />}
      {isAdmin ? 'Admin' : 'Seller'}
    </div>
  );
}
