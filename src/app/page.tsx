'use client';

import Link from 'next/link';
import { ShoppingCart, Package, Users, TrendingUp, ArrowRight, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Logo } from '@/components/common/Logo';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="px-6 py-2 font-semibold text-slate-700 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
            >
              Login
            </Link>
            <Link
              href="/register-seller"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 active:scale-95"
            >
              Become a Seller
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-2 w-fit">
                <Zap size={16} />
                Modern Admin Dashboard
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-slate-900 dark:text-white">
              Manage Your Store Like a Pro
            </h1>

            <p className="max-w-lg text-xl leading-relaxed text-slate-600 dark:text-slate-300">
              A modern, powerful admin dashboard for SnapBuy. Control products, orders, sellers, and users from one beautifully designed interface.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/login"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-95"
              >
                Admin Login
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/register-seller"
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-blue-200 bg-white px-8 py-4 font-semibold text-blue-600 transition-all hover:border-blue-600 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-900 dark:text-blue-300 dark:hover:bg-slate-800"
              >
                Apply as Seller
                <ArrowRight size={20} />
              </Link>
            </div>

          </div>

          {/* Right Column - Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 lg:p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-all mb-4">
                <ShoppingCart size={24} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Order Management</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">Track, manage, and fulfill customer orders in real-time</p>
            </div>

            {/* Card 2 */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 lg:p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-all mb-4">
                <Package size={24} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Product Control</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">Add, edit, and manage your entire product catalog</p>
            </div>

            {/* Card 3 */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 lg:p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-all mb-4">
                <Users size={24} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Seller Review</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">Approve and manage seller applications with ease</p>
            </div>

            {/* Card 4 */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 lg:p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-all mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Analytics</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">View detailed stats and insights about your business</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <p className="text-center text-slate-600 dark:text-slate-400">
            © 2026 SnapBuy Admin. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
