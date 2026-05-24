'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  trend?: 'up' | 'down';
}

export function StatCard({ title, value, change, icon, trend = 'up' }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-600 font-medium dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-2 dark:text-slate-100">{value}</p>
          {change !== undefined && (
            <div className={cn('flex items-center gap-1 mt-2 text-sm', trend === 'up' ? 'text-green-600' : 'text-red-600')}>
              {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{Math.abs(change)}% from last month</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
          {icon}
        </div>
      </div>
    </div>
  );
}
