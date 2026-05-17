'use client';

import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone,
  MapPin,
  Store,
  Clock, 
  LogOut, 
  CheckCircle2, 
  Package, 
  ShoppingCart,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { ActionButton } from '@/components/ui/ActionButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { InfoRow } from '@/components/ui/InfoRow';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { mockSellerUser } from '@/lib/mockAuth';
import { logout } from '@/services/authService';

export function SellerSettings() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="space-y-6">
      {/* Seller Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <User size={20} />
          Seller Profile
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {mockSellerUser.avatar}
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">{mockSellerUser.ownerName}</h4>
              <p className="text-sm text-slate-600">{mockSellerUser.email}</p>
            </div>
          </div>

          <InfoRow 
            label="Email Address" 
            value={mockSellerUser.email}
            icon={<Mail size={18} />}
          />
          <InfoRow 
            label="Phone Number" 
            value={mockSellerUser.phone}
            icon={<Phone size={18} />}
          />
          <InfoRow 
            label="Seller ID" 
            value={mockSellerUser.uid}
            icon={<Store size={18} />}
          />
          <div className="pt-2">
            <RoleBadge role="seller" size="sm" />
          </div>
        </div>
      </div>

      {/* Shop Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Store size={20} />
          Shop Profile
        </h3>
        
        <div className="space-y-4">
          <InfoRow 
            label="Shop Name" 
            value={mockSellerUser.shopName}
            icon={<Store size={18} />}
          />
          <InfoRow 
            label="Address" 
            value={mockSellerUser.shopAddress}
            icon={<MapPin size={18} />}
          />
          <InfoRow 
            label="Business Category" 
            value={mockSellerUser.category}
            icon={<Package size={18} />}
          />
          <div className="py-3 border-b border-slate-100 flex items-start justify-between last:border-b-0">
            <span className="text-sm font-medium text-slate-600">Shop Status</span>
            <StatusBadge 
              text={mockSellerUser.status.charAt(0).toUpperCase() + mockSellerUser.status.slice(1)} 
              variant={mockSellerUser.status === 'approved' ? 'success' : 'warning'}
              size="sm"
            />
          </div>
          <InfoRow 
            label="Created" 
            value={new Date(mockSellerUser.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            icon={<Clock size={18} />}
          />
        </div>
      </div>

      {/* Seller Permissions Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <CheckCircle2 size={20} />
          Seller Permissions
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <Package className="text-emerald-600" size={20} />
            <div>
              <p className="font-medium text-slate-900">Add Products</p>
              <p className="text-xs text-slate-600">Can add new products to your shop</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <Package className="text-emerald-600" size={20} />
            <div>
              <p className="font-medium text-slate-900">Edit Your Products</p>
              <p className="text-xs text-slate-600">Can edit and update your own products</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <ShoppingCart className="text-emerald-600" size={20} />
            <div>
              <p className="font-medium text-slate-900">View Your Orders</p>
              <p className="text-xs text-slate-600">Can view all orders for your products</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShoppingCart className="text-emerald-600" size={20} />
            <div>
              <p className="font-medium text-slate-900">Update Order Status</p>
              <p className="text-xs text-slate-600">Can update order statuses for your orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payout & Payment Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <CreditCard size={20} />
          Payout & Payment Settings
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="text-emerald-600" size={18} />
              <p className="font-semibold text-emerald-900">Coming Soon</p>
            </div>
            <p className="text-sm text-emerald-800">
              Payment methods, bank account details, and payout settings will be available after Firebase integration. 
              For now, payouts are managed manually by the admin team.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Preferred Payment Method</span>
              <span className="text-sm text-slate-600">Not configured</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Bank/Mobile Banking</span>
              <span className="text-sm text-slate-600">Not configured</span>
            </div>
          </div>
        </div>
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
