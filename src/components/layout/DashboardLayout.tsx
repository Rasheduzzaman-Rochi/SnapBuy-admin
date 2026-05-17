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
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
