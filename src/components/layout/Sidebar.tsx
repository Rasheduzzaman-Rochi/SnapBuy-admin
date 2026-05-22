'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Store,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/services/authService';
import { Logo } from '@/components/common/Logo';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode | any;
}

const adminMenuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Seller Applications', href: '/sellers', icon: Store },
  { label: 'Products', href: '/products', icon: Package },
  { label: 'Orders', href: '/orders', icon: ShoppingCart },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Settings', href: '/settings', icon: Settings },
];

const sellerMenuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Products', href: '/products', icon: Package },
  { label: 'Add Product', href: '/products/add', icon: Plus },
  { label: 'My Orders', href: '/orders', icon: ShoppingCart },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, loading } = useAuth();

  const isAdmin = role === 'admin';
  const menuItems = useMemo(() => (loading ? [] : isAdmin ? adminMenuItems : sellerMenuItems), [isAdmin, loading]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const roleLabel = isAdmin ? 'Admin Panel' : 'Seller Panel';

  return (
    <aside className="hidden md:fixed md:left-0 md:top-0 md:z-40 md:flex md:h-screen md:w-64 md:flex-col md:border-r md:border-slate-200 md:bg-white md:text-slate-900 md:shadow-sm dark:md:border-slate-800 dark:md:bg-slate-950 dark:md:text-slate-100">
      {/* Logo Section */}
      <div className="px-6 py-8 border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-3">
          <Logo size="md" subtitle={loading ? 'Loading...' : roleLabel} />
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          const activeColor = isAdmin ? 'bg-blue-600 shadow-blue-500/30' : 'bg-emerald-600 shadow-emerald-500/30';

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? `${activeColor} text-white shadow-lg`
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-red-600 transition-all duration-200 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-red-400"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
