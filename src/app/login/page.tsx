'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Logo } from '@/components/common/Logo';
import { useAuth } from '@/hooks/useAuth';
import { PENDING_SELLER_APPLICATION_FORM_KEY } from '@/lib/sellerApplicationStorage';

export default function LoginPage() {
  const router = useRouter();
  const { user, role, loading: authLoading, refreshRole } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(false);
  const [nextAction, setNextAction] = useState<string | null>(null);
  const applyingSellerRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    const emailParam = params.get('email');

    setNextAction(next);
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  useEffect(() => {
    if (!pendingRedirect || authLoading || !role) return;

    if (nextAction === 'apply-seller') {
      if (!user || applyingSellerRef.current) return;
      applyingSellerRef.current = true;

      async function continueSellerApplication() {
        try {
          const pendingFormJson = window.localStorage.getItem(PENDING_SELLER_APPLICATION_FORM_KEY);

          if (!pendingFormJson) {
            throw new Error('Seller application details were not found. Please fill out the seller application again.');
          }

          const pendingForm = JSON.parse(pendingFormJson);
          const expectedEmail = pendingForm.email?.toString().trim().toLowerCase();
          const loggedInEmail = user.email?.trim().toLowerCase();

          if (expectedEmail && loggedInEmail !== expectedEmail) {
            throw new Error('Please login with the same email you used on the seller application form.');
          }

          const { createSellerApplicationForUser } = await import('@/services/sellerService');

          await createSellerApplicationForUser(user, pendingForm);
          window.localStorage.removeItem(PENDING_SELLER_APPLICATION_FORM_KEY);
          await refreshRole();
          router.push('/pending-approval');
        } catch (err: any) {
          setError(err.message || 'Could not continue seller application.');
          setLoading(false);
          setPendingRedirect(false);
          applyingSellerRef.current = false;
        }
      }

      continueSellerApplication();
      return;
    }

    if (role === 'admin' || role === 'approved') {
      router.push('/dashboard');
      return;
    }

    if (role === 'pending') {
      router.push('/pending-approval');
      return;
    }

    if (role === 'rejected') {
      setError('Your seller application has been rejected. Please contact support.');
      setLoading(false);
      setPendingRedirect(false);
      return;
    }

    router.push('/register-seller');
  }, [authLoading, nextAction, pendingRedirect, refreshRole, role, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Dynamically import to defer Firebase loading
      const { loginWithEmail } = await import('@/services/authService');
      const result = await loginWithEmail(email, password);

      if (result.success) {
        setPendingRedirect(true);
      } else {
        setError(result.error || 'Login failed');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 px-4 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center py-8">
        <div className="absolute right-4 top-4 md:right-8 md:top-8">
          <ThemeToggle />
        </div>
        {/* Card */}
        <div className="w-full rounded-xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center justify-center text-center">
            <Logo showText={false} size="lg" className="justify-center" />
            <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">SnapBuy</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Admin & Seller Dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">
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
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                {error}
              </div>
            )}

            {nextAction === 'apply-seller' && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-100">
                This email already has an account. Login with the same email to continue your seller application.
              </div>
            )}

            {/* Info Note */}
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-2.5 font-semibold text-white transition-all hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Logging in...' : nextAction === 'apply-seller' ? 'Login and Continue Application' : 'Login'}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-3 text-sm sm:flex-row sm:justify-between">
            <Link
              href="/register-seller"
              className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-300 dark:hover:text-emerald-200"
            >
              Apply as Seller
            </Link>
            <Link
              href="/"
              className="font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
