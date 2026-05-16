'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Topbar />
      <main className="md:ml-64 pt-16">
        <div className="px-4 py-8 md:px-8 md:py-12 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
