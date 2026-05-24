'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { AccessDenied } from '@/components/ui/AccessDenied';
import type { SellerApplication } from '@/types/seller';
import {
  getSellerApplications,
  approveSeller,
  rejectSeller,
  deleteSellerApplication,
} from '@/services/sellerService';
import { useDashboardSearch } from '@/components/providers/DashboardSearchProvider';
import { useAuth } from '@/hooks/useAuth';

const SellerApplicationsTable = dynamic(
  () => import('@/components/sellers/SellerApplicationsTable').then((mod) => mod.SellerApplicationsTable),
  {
    loading: () => (
      <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900" />
    ),
  }
);

export default function SellersPage() {
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { query } = useDashboardSearch();
  const { user, role, loading: authLoading } = useAuth();
  const uid = user?.uid;
  const fetchKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (authLoading || role !== 'admin') return;
    if (!uid) return;

    const fetchKey = `admin:${uid}`;
    if (fetchKeyRef.current === fetchKey) return;
    fetchKeyRef.current = fetchKey;

    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);
        const apps = await getSellerApplications();
        if (!mounted) return;
        setApplications(apps);
      } catch (e: any) {
        console.error('Error loading applications:', e);
        setError(e?.message || String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [authLoading, role, uid]);

  const handleApprove = async (uid: string) => {
    if (!user) return;
    try {
      setError(null);
      setSuccess(null);
      const result = await approveSeller(uid, user.uid);
      if (!result.success) throw new Error(result.error);
      setApplications((prev) => prev.map((a) => (a.uid === uid ? { ...a, status: 'approved', approvedBy: user.uid, approvedAt: new Date().toISOString() } : a)));
      setSuccess('Seller approved successfully.');
    } catch (e: any) {
      console.error('Approve failed:', e);
      setError(e?.message || 'Failed to approve application');
    }
  };

  const handleReject = async (uid: string) => {
    if (!user) return;
    try {
      setError(null);
      setSuccess(null);
      const result = await rejectSeller(uid, user.uid);
      if (!result.success) throw new Error(result.error);
      setApplications((prev) => prev.map((a) => (a.uid === uid ? { ...a, status: 'rejected', rejectedBy: user.uid, rejectedAt: new Date().toISOString() } : a)));
      setSuccess('Seller rejected successfully.');
    } catch (e: any) {
      console.error('Reject failed:', e);
      setError(e?.message || 'Failed to reject application');
    }
  };

  const handleDelete = async (sellerUid: string) => {
    try {
      setError(null);
      setSuccess(null);
      const result = await deleteSellerApplication(sellerUid);
      if (!result.success) throw new Error(result.error);

      const apps = await getSellerApplications();
      setApplications(apps);
      setSuccess('Seller removed successfully. The buyer account remains active.');
    } catch (e: any) {
      console.error('Remove seller failed:', e);
      setError(e?.message || 'Failed to remove seller');
    }
  };

  const pendingCount = useMemo(
    () => applications.filter((a) => (a.status || 'pending') === 'pending').length,
    [applications]
  );
  const filteredApplications = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    return applications.filter((app) =>
      app.shopName.toLowerCase().includes(searchTerm) ||
      app.ownerName.toLowerCase().includes(searchTerm) ||
      app.email.toLowerCase().includes(searchTerm) ||
      app.phone.toLowerCase().includes(searchTerm)
    );
  }, [applications, query]);

  // Loading user
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-600 mt-4">Checking permissions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Not signed in or not admin
  if (!user || role !== 'admin') {
    return (
      <DashboardLayout>
        <AccessDenied />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <PageHeader title="Seller Applications" description={`${pendingCount} pending review${pendingCount !== 1 ? 's' : ''}`} />

        {loading && <p className="text-slate-600 dark:text-slate-300">Loading seller applications...</p>}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
            {success}
          </div>
        )}
        {!loading && applications.length === 0 && <p className="text-slate-600 dark:text-slate-300">No seller applications found.</p>}

        {!loading && applications.length > 0 && filteredApplications.length === 0 && (
          <p className="text-slate-600 dark:text-slate-300">No seller applications match your search.</p>
        )}

        {!loading && filteredApplications.length > 0 && (
          <SellerApplicationsTable
            applications={filteredApplications}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
            adminUid={user.uid}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
