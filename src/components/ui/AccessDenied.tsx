'use client';

import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';

export function AccessDenied() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center dark:bg-slate-900 dark:border-slate-800">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-4 dark:bg-red-500/15">
            <Lock className="text-red-600" size={32} />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-3 dark:text-slate-100">Access Denied</h1>
        
        <p className="text-slate-600 mb-8 dark:text-slate-400">
          You do not have permission to access this page. This area is restricted based on your user role.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          <ArrowLeft size={18} />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
