'use client';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, Clock, AlertCircle, Users, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockOrders, mockProducts, mockUsers, mockSellerApplications } from '@/data/mockData';
import { getCurrentMockRole, mockAdminUser, mockSellerUser } from '@/lib/mockAuth';

export default function DashboardPage() {
  const [role, setRole] = useState<'admin' | 'seller'>('admin');

  useEffect(() => {
    setRole(getCurrentMockRole());
  }, []);

  // Filter data based on role
  const currentSellerId = role === 'seller' ? mockSellerUser.uid : null;
  const sellerProducts = currentSellerId 
    ? mockProducts.filter(p => p.sellerId === currentSellerId)
    : mockProducts;
  const sellerOrders = currentSellerId
    ? mockOrders.filter(o => o.sellerId === currentSellerId)
    : mockOrders;

  // Admin stats
  const totalSellers = mockSellerApplications.length;
  const pendingApplications = mockSellerApplications.filter(s => s.status === 'pending').length;
  const totalProducts = mockProducts.length;
  const totalOrders = mockOrders.length;
  const totalSales = mockOrders.reduce((sum, order) => sum + order.total, 0);
  const totalUsers = mockUsers.length;

  // Seller stats
  const myProductCount = sellerProducts.length;
  const myOrderCount = sellerOrders.length;
  const mySales = sellerOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = sellerOrders.filter(o => o.orderStatus === 'placed' || o.orderStatus === 'processing').length;
  const lowStockProducts = sellerProducts.filter(p => p.stock < 10);

  // Render Admin Dashboard
  if (role === 'admin') {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          {/* Page Header */}
          <PageHeader
            title="Dashboard"
            description="Welcome back! Here's your platform overview."
          />

          {/* Admin Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Sellers"
              value={totalSellers}
              icon={<Users size={24} />}
              change={2}
              trend="up"
            />
            <StatCard
              title="Pending Applications"
              value={pendingApplications}
              icon={<Clock size={24} />}
              change={1}
              trend="up"
            />
            <StatCard
              title="Total Products"
              value={totalProducts}
              icon={<Package size={24} />}
              change={12}
              trend="up"
            />
            <StatCard
              title="Total Orders"
              value={totalOrders}
              icon={<ShoppingCart size={24} />}
              change={8}
              trend="up"
            />
            <StatCard
              title="Total Sales"
              value={`৳${(totalSales / 100000).toFixed(1)}L`}
              icon={<DollarSign size={24} />}
              change={15}
              trend="up"
            />
            <StatCard
              title="Total Users"
              value={totalUsers}
              icon={<Users size={24} />}
              change={5}
              trend="up"
            />
          </div>

          {/* Recent Orders Table */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Orders</h2>
            <RecentOrdersTable />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Render Seller Dashboard
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <PageHeader
          title="My Dashboard"
          description="Welcome to your seller dashboard. Here's your business overview."
        />

        {/* Seller Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="My Products"
            value={myProductCount}
            icon={<Package size={24} />}
            change={2}
            trend="up"
          />
          <StatCard
            title="My Orders"
            value={myOrderCount}
            icon={<ShoppingCart size={24} />}
            change={3}
            trend="up"
          />
          <StatCard
            title="My Sales"
            value={`৳${(mySales / 100000).toFixed(1)}L`}
            icon={<DollarSign size={24} />}
            change={10}
            trend="up"
          />
          <StatCard
            title="Pending Orders"
            value={pendingOrders}
            icon={<Clock size={24} />}
            change={-2}
            trend="down"
          />
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-lg">
            <div className="flex gap-4">
              <AlertCircle className="text-amber-600 flex-shrink-0" size={24} />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 mb-2">Low Stock Alert</h3>
                <p className="text-amber-800 text-sm mb-3">
                  {lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''} have low inventory. Consider restocking soon.
                </p>
                <div className="flex flex-wrap gap-2">
                  {lowStockProducts.slice(0, 3).map((product) => (
                    <StatusBadge key={product.id} text={`${product.name} (${product.stock})`} variant="warning" size="sm" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Orders Table */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">My Recent Orders</h2>
          <RecentOrdersTable orders={sellerOrders.slice(0, 5)} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <a
            href="/products/add"
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 rounded-xl p-3">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Add New Product</h3>
                <p className="text-sm text-slate-600">Create a new product listing</p>
              </div>
            </div>
          </a>

          <a
            href="/orders"
            className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-emerald-600 rounded-xl p-3">
                <ShoppingCart className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">View All Orders</h3>
                <p className="text-sm text-slate-600">Manage your orders</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
