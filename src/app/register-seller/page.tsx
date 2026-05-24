'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Logo } from '@/components/common/Logo';

export default function RegisterSellerPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    shopName: '',
    shopPhone: '',
    address: '',
    category: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const mobileNumber = formData.mobileNumber.trim();

      if (mobileNumber.length < 10) {
        setError('Mobile number must be at least 10 digits.');
        setLoading(false);
        return;
      }

      // Dynamically import to defer Firebase loading
      const { registerSeller } = await import('@/services/authService');
      const result = await registerSeller(formData.email, formData.password, {
        name: formData.fullName,
        mobile: mobileNumber,
        shopName: formData.shopName,
        phone: formData.shopPhone || mobileNumber,
        address: formData.address,
        category: formData.category,
      });

      if (result.success) {
        // Redirect to pending approval page
        router.push('/pending-approval');
      } else {
        setError(result.error || 'Registration failed');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Books', 'Sports', 'Other'];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4 py-12 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex justify-end">
          <ThemeToggle />
        </div>
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="mb-6 flex justify-center">
            <Logo size="lg" subtitle="Seller Registration" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 dark:text-white">Become a Seller</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Join SnapBuy and grow your business</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                {error}
              </div>
            )}

            {/* Buyer/Profile Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Buyer/Profile Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                    placeholder="01712345678"
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>

            {/* Shop Information */}
            <div className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">2</div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Shop Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">Shop Name *</label>
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    required
                    placeholder="Your shop name"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">Shop Phone</label>
                  <input
                    type="tel"
                    name="shopPhone"
                    value={formData.shopPhone}
                    onChange={handleChange}
                    placeholder="Use mobile if same"
                    className="input-field w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">Business Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="select-field w-full"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">Shop Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Full shop address"
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">3</div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Account Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Create a strong password"
                      className="input-field w-full pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="flex gap-3 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-50 p-4 dark:border-blue-500/20 dark:from-blue-500/10 dark:to-blue-500/10">
              <CheckCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-semibold mb-1">Pending Review</p>
                <p>Your application will be reviewed by our team within 24-48 hours. You'll receive a confirmation email once approved.</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-blue-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
              <Link
                href="/"
                className="flex-1 rounded-xl border-2 border-slate-200 px-6 py-3 text-center font-semibold text-slate-900 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
