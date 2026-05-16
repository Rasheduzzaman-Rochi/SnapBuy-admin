'use client';

import { Search, Bell, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCurrentMockRole, UserRole } from '@/lib/mockAuth';

interface User {
  name: string;
  email: string;
  role: string;
}

export function Topbar() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('admin');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setRole(getCurrentMockRole());
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const roleBadgeColor = role === 'admin' 
    ? 'bg-blue-100 text-blue-700' 
    : 'bg-emerald-100 text-emerald-700';
  
  const profileBgColor = role === 'admin'
    ? 'from-blue-400 to-blue-600'
    : 'from-emerald-400 to-emerald-600';

  return (
    <header className="md:ml-64 bg-white border-b border-slate-200 h-16 sticky top-0 z-30 flex items-center">
      <div className="w-full px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 hover:bg-slate-100 rounded-lg">
          <Menu size={20} className="text-slate-600" />
        </button>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden sm:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products, orders..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Admin Profile */}
          <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200">
            {user && (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${roleBadgeColor}`}>
                    {role === 'admin' ? 'Admin' : 'Seller'}
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

