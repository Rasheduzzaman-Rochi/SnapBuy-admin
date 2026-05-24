'use client';

import { Bell, Menu, Search } from 'lucide-react';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardSearch } from '@/components/providers/DashboardSearchProvider';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const { user, role, loading } = useAuth();
  const { query, setQuery } = useDashboardSearch();

  const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase();

  const roleBadgeColor = role === 'admin'
    ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300';
  
  const profileBgColor = role === 'admin'
    ? 'from-blue-400 to-blue-600'
    : 'from-emerald-400 to-emerald-600';

  const searchPlaceholder = useMemo(() => {
    if (pathname.startsWith('/products')) return 'Search products, orders, sellers...';
    if (pathname.startsWith('/orders')) return 'Search products, orders, sellers...';
    if (pathname.startsWith('/sellers')) return 'Search products, orders, sellers...';
    if (pathname.startsWith('/users')) return 'Search products, orders, sellers...';
    return 'Search products, orders, sellers...';
  }, [pathname]);

  const roleLabel = loading ? 'Loading...' : role === 'admin' ? 'Admin' : 'Seller';
  const displayName = user?.displayName || user?.email || 'User';

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-950/90 md:ml-64 md:w-[calc(100%-16rem)]">
      <div className="grid w-full grid-cols-[auto_auto] items-center gap-3 px-4 py-3 sm:px-6 md:h-16 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-4 md:py-0 lg:px-8">
        {/* Left Menu / Spacer */}
        <div className="flex min-w-0 items-center">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-900 md:hidden"
            aria-label="Open navigation"
          >
            <Menu size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
          <div className="hidden md:block h-10 w-10" aria-hidden="true" />
        </div>

        {/* Centered Search */}
        <div className="col-span-2 row-start-2 flex w-full justify-center md:col-span-1 md:col-start-2 md:row-start-1 md:min-w-0">
          <div className="relative mx-auto w-full max-w-2xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors dark:text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-900"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 justify-self-end sm:gap-4 md:col-start-3">
          <ThemeToggle />

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
                  <p className="max-w-40 truncate text-sm font-medium text-slate-900 dark:text-slate-100">{displayName}</p>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${roleBadgeColor}`}>
                    {roleLabel}
                  </span>
                </div>
                <div className={`w-10 h-10 bg-gradient-to-br ${profileBgColor} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                  {getInitials(displayName)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
