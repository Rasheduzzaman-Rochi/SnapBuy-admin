'use client';

import dynamic from 'next/dynamic';
import { Package, ShoppingCart, DollarSign, Clock, AlertCircle, Users, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { useSellerContext } from '@/hooks/useSellerContext';
import { useEffect, useRef, useState } from 'react';
import { getProducts } from '@/services/productService';
import { getOrders } from '@/services/orderService';
import { getAllUsers } from '@/services/userService';
import { getSellerApplications } from '@/services/sellerService';
import { Product } from '@/types/product';
import { Order } from '@/types/order';
import { User } from '@/types/user';
import { SellerApplication } from '@/types/seller';

const RecentOrdersTable = dynamic(
  () => import('@/components/dashboard/RecentOrdersTable').then((mod) => mod.RecentOrdersTable),
  {
    loading: () => (
      <div className="h-48 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900" />
    ),
  }
);

export default function DashboardPage() {
  const { user, role, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [sellerApplications, setSellerApplications] = useState<SellerApplication[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sellerContext, loading: sellerContextLoading } = useSellerContext(user, role);
  const uid = user?.uid;
  const email = user?.email;
  const sellerShopName = sellerContext?.shopName ?? '';
  const fetchKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (loading || sellerContextLoading || !role) return;

    if (role !== 'admin' && role !== 'approved') return;
    if (role === 'approved' && !uid) return;

    const fetchKey = `${role}:${uid ?? 'admin'}:${sellerShopName}`;
    if (fetchKeyRef.current === fetchKey) return;
    fetchKeyRef.current = fetchKey;

    let mounted = true;

    async function loadDashboardData() {
      try {
        setDataLoading(true);
        setError(null);

        const sellerLookupContext = role === 'approved'
          ? { uid: uid ?? '', email, shopName: sellerShopName }
          : null;

        const [loadedProducts, loadedOrders, loadedUsers, loadedApplications] = await Promise.all([
          getProducts(role, uid, sellerLookupContext),
          getOrders(role, uid, sellerLookupContext),
          role === 'admin' ? getAllUsers() : Promise.resolve([]),
          role === 'admin' ? getSellerApplications() : Promise.resolve([]),
        ]);

        if (!mounted) return;

        setProducts(loadedProducts);
        setOrders(loadedOrders);
        setUsers(loadedUsers);
        setSellerApplications(loadedApplications);
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Failed to load dashboard data.');
      } finally {
        if (mounted) setDataLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      mounted = false;
    };
  }, [email, loading, role, sellerContextLoading, sellerShopName, uid]);

  if (loading || sellerContextLoading || dataLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[50vh] items-center justify-center text-slate-600 dark:text-slate-300">
          Loading dashboard...
        </div>
      </DashboardLayout>
    );
  }

  // Admin stats
  const totalSellers = sellerApplications.length;
  const pendingApplications = sellerApplications.filter(s => s.status === 'pending').length;
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalUsers = users.length;

  // Seller stats
  const myProductCount = products.length;
  const myOrderCount = orders.length;
  const mySales = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.orderStatus === 'placed' || o.orderStatus === 'processing').length;
  const lowStockProducts = products.filter(p => p.stock <= 5);

  // Render Admin Dashboard
  if (role === 'admin') {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <PageHeader
            title="Dashboard"
            description="Welcome back! Here's your platform overview."
          />

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Admin Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Orders</h2>
            <RecentOrdersTable orders={orders.slice(0, 5)} />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Render Seller Dashboard
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="My Dashboard"
          description="Welcome to your seller dashboard. Here's your business overview."
        />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}

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
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Recent Orders</h2>
          <RecentOrdersTable orders={orders.slice(0, 5)} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <a
            href="/products/add"
            className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 transition-shadow hover:shadow-lg dark:border-slate-800 dark:from-slate-900 dark:to-slate-800"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-600 p-3">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Add New Product</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Create a new product listing</p>
              </div>
            </div>
          </a>

          <a
            href="/orders"
            className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 transition-shadow hover:shadow-lg dark:border-slate-800 dark:from-slate-900 dark:to-slate-800"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-emerald-600 p-3">
                <ShoppingCart className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">View All Orders</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Manage your orders</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
