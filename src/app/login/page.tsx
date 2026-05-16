'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff, Shield, Store } from 'lucide-react';
import { validateLogin } from '@/lib/auth';
import { setMockRole } from '@/lib/mockAuth';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate credentials
    const result = validateLogin(email, password);
    
    if (result.success && result.user) {
      // Determine role from email
      const role = email.includes('admin') ? 'admin' : 'seller';
      setMockRole(role);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } else {
      setError(result.error || 'Login failed');
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: 'admin' | 'seller') => {
    setLoading(true);
    setMockRole(role);
    
    const mockUser = role === 'admin' 
      ? { uid: 'admin_001', name: 'Rashed Admin', email: 'admin@snapbuy.com', role: 'admin' }
      : { uid: 'seller_001', name: 'SnapBuy Seller', email: 'seller@snapbuy.com', role: 'seller' };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 300);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              SB
            </div>
            <h1 className="text-2xl font-bold text-slate-900">SnapBuy</h1>
            <p className="text-slate-600 text-sm mt-2">Admin & Seller Dashboard</p>
          </div>

          {/* Quick Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleQuickLogin('admin')}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Shield size={20} />
              Continue as Admin
            </button>
            
            <button
              onClick={() => handleQuickLogin('seller')}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Store size={20} />
              Continue as Seller
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Manual Login</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
              <strong>Demo Credentials:</strong>
              <div className="mt-2 space-y-1">
                <div><strong>Admin:</strong> admin@snapbuy.com / admin123</div>
                <div><strong>Seller:</strong> seller@snapbuy.com / seller123</div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">New to SnapBuy?</span>
            </div>
          </div>

          {/* Seller Registration Link */}
          <Link
            href="/register-seller"
            className="w-full py-2.5 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors text-center block"
          >
            Apply as Seller
          </Link>

          {/* Footer */}
          <p className="text-center text-sm text-slate-600 mt-6">
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
