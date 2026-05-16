'use client';

import Link from 'next/link';
import { ShoppingCart, Package, Users, TrendingUp, ArrowRight, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              SB
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">SnapBuy</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-6 py-2 text-slate-700 font-semibold hover:text-blue-600 transition-colors"
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

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
              Manage Your Store Like a Pro
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
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
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-200 hover:border-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
              >
                Apply as Seller
                <ArrowRight size={20} />
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-3">Demo Credentials:</p>
              <div className="space-y-2 text-sm font-mono text-slate-700 bg-slate-100 rounded-lg p-4">
                <p><span className="text-slate-500">Admin:</span> admin@snapbuy.com / admin123</p>
                <p><span className="text-slate-500">Seller:</span> seller@snapbuy.com / seller123</p>
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="group bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-all mb-4">
                <ShoppingCart size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Order Management</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Track, manage, and fulfill customer orders in real-time</p>
            </div>

            {/* Card 2 */}
            <div className="group bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-all mb-4">
                <Package size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Product Control</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Add, edit, and manage your entire product catalog</p>
            </div>

            {/* Card 3 */}
            <div className="group bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-all mb-4">
                <Users size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Seller Review</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Approve and manage seller applications with ease</p>
            </div>

            {/* Card 4 */}
            <div className="group bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-all mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Analytics</h3>
              <p className="text-slate-600 text-sm leading-relaxed">View detailed stats and insights about your business</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <p className="text-center text-slate-600">
            © 2024 SnapBuy Admin. Built with modern design principles for optimal user experience.
          </p>
        </div>
      </div>
    </main>
  );
}
