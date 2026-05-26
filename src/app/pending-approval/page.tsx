'use client';

import Link from 'next/link';
import { Clock, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Logo } from '@/components/common/Logo';

export default function PendingApprovalPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4 py-12 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
      <div className="mx-auto flex w-full max-w-md flex-col">
        <div className="mb-6 flex justify-end">
          <ThemeToggle />
        </div>
        <div className="mb-6 flex justify-center">
          <Logo size="md" subtitle="Seller Application" />
        </div>
        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 md:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center dark:from-amber-500/15 dark:to-amber-500/10">
              <Clock size={48} className="text-amber-600" />
            </div>
          </div>

          {/* Content */}
          <h1 className="mb-3 text-center text-3xl font-bold text-slate-900 dark:text-white">
            Application Pending
          </h1>

          <p className="mb-6 text-center leading-relaxed text-slate-600 dark:text-slate-300">
            Your seller application is under review. We'll grant you dashboard access once the admin approves your request.
          </p>

          {/* Info Box */}
          <div className="mb-8 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-50 p-4 dark:border-blue-500/20 dark:from-blue-500/10 dark:to-blue-500/10">
            <div className="flex gap-3">
              <div className="text-blue-600 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-semibold mb-1">Typical Review Time</p>
                <p>We review applications within <strong>24-48 hours</strong>. You'll receive an email notification once approved.</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-8 space-y-3">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">✓</div>
                <div className="w-0.5 h-8 bg-slate-300"></div>
              </div>
              <div className="pb-4">
                <p className="font-semibold text-slate-900 dark:text-white">Application Submitted</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Your seller profile has been created</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm">⏳</div>
                <div className="w-0.5 h-8 bg-slate-300"></div>
              </div>
              <div className="pb-4">
                <p className="font-semibold text-slate-900 dark:text-white">Under Review</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Our team is verifying your information</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">→</div>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Access Granted</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">You'll receive email confirmation and can login</p>
              </div>
            </div>
          </div>

          {/* Button */}
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
            Back to Login
          </Link>

          {/* Support Text */}
          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Have questions? Contact us at <a href="mailto:support@snapbuy.com" className="text-blue-600 font-medium hover:underline">support@snapbuy.com</a>
          </p>
        </div>
      </div>
    </main>
  );
}
