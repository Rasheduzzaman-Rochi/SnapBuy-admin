'use client';

import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Shield, 
  Clock, 
  LogOut, 
  CheckCircle2, 
  Package, 
  ShoppingCart, 
  Users,
  Moon,
  Bell,
  Lock
} from 'lucide-react';
import { ActionButton } from '@/components/ui/ActionButton';
import { InfoRow } from '@/components/ui/InfoRow';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { logout, type AdminProfile, type AuthUser } from '@/services/authService';
import { useTheme } from '@/components/providers/ThemeProvider';
import { formatDate, getInitials } from '@/lib/utils';

interface AdminSettingsProps {
  user: AuthUser | null;
  adminProfile: AdminProfile | null;
}

export function AdminSettings({ user, adminProfile }: AdminSettingsProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const adminEmail = user?.email ?? adminProfile?.email ?? '';
  const adminName = adminProfile?.name || user?.displayName || adminEmail || 'Admin';

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="space-y-6">
      {/* Admin Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <User size={20} />
          Admin Profile
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {getInitials(adminName)}
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">{adminName}</h4>
              <p className="text-sm text-slate-600">{adminEmail}</p>
            </div>
          </div>

          <InfoRow 
            label="Email Address" 
            value={adminEmail || 'N/A'}
            icon={<Mail size={18} />}
          />
          <InfoRow 
            label="Admin ID" 
            value={user?.uid ?? adminProfile?.uid ?? 'N/A'}
            icon={<Shield size={18} />}
          />
          <InfoRow 
            label="Joined" 
            value={formatDate(adminProfile?.createdAt)}
            icon={<Clock size={18} />}
          />
          <div className="pt-2">
            <RoleBadge role="admin" size="sm" />
          </div>
        </div>
      </div>

      {/* Admin Permissions Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <CheckCircle2 size={20} />
          Admin Permissions
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <Shield className="text-blue-600" size={20} />
            <div>
              <p className="font-medium text-slate-900">Seller Applications</p>
              <p className="text-xs text-slate-600">Can approve or reject seller applications</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <Package className="text-blue-600" size={20} />
            <div>
              <p className="font-medium text-slate-900">Products Management</p>
              <p className="text-xs text-slate-600">Can view and manage all products from all sellers</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <ShoppingCart className="text-blue-600" size={20} />
            <div>
              <p className="font-medium text-slate-900">Orders Management</p>
              <p className="text-xs text-slate-600">Can view and update all orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="text-blue-600" size={20} />
            <div>
              <p className="font-medium text-slate-900">Users Management</p>
              <p className="text-xs text-slate-600">Can view all registered users and their details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Preferences Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 dark:text-slate-100">
          <Moon size={20} />
          Platform Preferences
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors dark:hover:bg-slate-800">
              <span className="font-medium text-slate-900 dark:text-slate-100">Dark Mode</span>
              <input
                type="checkbox"
                checked={resolvedTheme === 'dark'}
                onChange={(event) => setTheme(event.target.checked ? 'dark' : 'light')}
                className="w-4 h-4"
              />
            </label>
          </div>

          <div>
            <label className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors dark:hover:bg-slate-800">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-slate-600 dark:text-slate-300" />
                <span className="font-medium text-slate-900 dark:text-slate-100">Email Notifications</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </label>
          </div>

          <div>
            <label className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors dark:hover:bg-slate-800">
              <span className="font-medium text-slate-900 dark:text-slate-100">Product Updates</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings Placeholder */}
      <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-3">
          <Lock className="text-slate-400" size={20} />
          <h3 className="text-lg font-bold text-slate-900">Security Settings</h3>
        </div>
        <p className="text-sm text-slate-600">
          Security settings like password change and two-factor authentication will be available after Firebase integration.
        </p>
      </div>

      {/* Logout Button */}
      <div>
        <ActionButton 
          onClick={handleLogout}
          variant="danger"
          className="w-full"
        >
          <LogOut size={20} />
          Logout
        </ActionButton>
      </div>
    </div>
  );
}
