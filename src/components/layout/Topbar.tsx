'use client';

import { Bell, Menu, MoonStar, Search, SunMedium } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardSearch } from '@/components/providers/DashboardSearchProvider';
import { useTheme } from '@/components/providers/ThemeProvider';

interface User {
  name: string;
  email: string;
  role: string;
}

export function Topbar() {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const { role, loading } = useAuth();
  const { query, setQuery } = useDashboardSearch();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase();

  const roleBadgeColor = role === 'admin'
    ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300';
  
  const profileBgColor = role === 'admin'
    ? 'from-blue-400 to-blue-600'
    : 'from-emerald-400 to-emerald-600';

  const searchPlaceholder = useMemo(() => {
    if (pathname.startsWith('/products')) return 'Search products by name or category...';
    if (pathname.startsWith('/orders')) return 'Search order ID, customer, email, or phone...';
    if (pathname.startsWith('/sellers')) return 'Search shop, owner, email, or phone...';
    if (pathname.startsWith('/users')) return 'Search user name, email, or phone...';
    return 'Search the dashboard...';
  }, [pathname]);

  const roleLabel = loading ? 'Loading...' : role === 'admin' ? 'Admin' : 'Seller';

  return (
    <header className="md:ml-64 sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white/90 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-950/90">
      <div className="grid w-full grid-cols-[auto,1fr,auto] items-center gap-3 px-4 md:px-8">
        {/* Mobile Menu Button */}
        <button className="md:hidden rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-900">
          <Menu size={20} className="text-slate-600 dark:text-slate-300" />
        </button>

        {/* Centered Search */}
        <div className="flex w-full justify-center">
          <div className="relative w-full max-w-2xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-950"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4 justify-self-end">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunMedium size={20} /> : <MoonStar size={20} />}
          </button>

          {/* Notification Icon */}
          <button className="relative rounded-lg p-2 hover:bg-slate-100 transition-colors dark:hover:bg-slate-900">
            <Bell size={20} className="text-slate-600 dark:text-slate-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Admin Profile */}
          <div className="hidden sm:flex items-center gap-3 border-l border-slate-200 pl-4 dark:border-slate-800">
            {user && (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${roleBadgeColor}`}>
                    {roleLabel}
                  </span>
                </div>
                <div className={`w-10 h-10 bg-gradient-to-br ${profileBgColor} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                  {getInitials(user.name)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

