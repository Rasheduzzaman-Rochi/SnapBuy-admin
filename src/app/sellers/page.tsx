'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SellerApplicationsTable } from '@/components/sellers/SellerApplicationsTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { AccessDenied } from '@/components/ui/AccessDenied';
import type { SellerApplication } from '@/types/seller';
import { getCurrentUser } from '@/services/authService';
import {
  getSellerApplications,
  approveSeller,
  rejectSeller,
} from '@/services/sellerService';

export default function SellersPage() {
  const [user, setUser] = useState<any | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoadingUser(true);
    getCurrentUser()
      .then((u) => {
        if (!mounted) return;
        console.log('Current admin/user:', u);
        setUser(u);
      })
      .catch((e) => {
        console.error('Error getting current user:', e);
        setError(String(e));
      })
      .finally(() => mounted && setLoadingUser(false));

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    // Only admins should fetch applications
    if (user.role !== 'admin') return;

    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        console.log('Fetching sellerApplications...');
        const apps = await getSellerApplications();
        console.log('Seller applications count:', apps.length);
        console.log('Seller applications data:', apps);
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
  }, [user]);

  const handleApprove = async (uid: string) => {
    if (!user) return;
    try {
      await approveSeller(uid, user.uid);
      setApplications((prev) => prev.map((a) => (a.uid === uid ? { ...a, status: 'approved', approvedBy: user.uid, approvedAt: new Date().toISOString() } : a)));
    } catch (e) {
      console.error('Approve failed:', e);
      setError('Failed to approve application');
    }
  };

  const handleReject = async (uid: string) => {
    if (!user) return;
    try {
      await rejectSeller(uid, user.uid);
      setApplications((prev) => prev.map((a) => (a.uid === uid ? { ...a, status: 'rejected', rejectedBy: user.uid, rejectedAt: new Date().toISOString() } : a)));
    } catch (e) {
      console.error('Reject failed:', e);
      setError('Failed to reject application');
    }
  };

  // Loading user
  if (loadingUser) {
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
  if (!user || user.role !== 'admin') {
    return (
      <DashboardLayout>
        <AccessDenied />
      </DashboardLayout>
    );
  }

  const pendingCount = applications.filter((a) => (a.status || 'pending') === 'pending').length;

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <PageHeader title="Seller Applications" description={`${pendingCount} pending review${pendingCount !== 1 ? 's' : ''}`} />

        {loading && <p className="text-slate-600">Loading seller applications...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {!loading && applications.length === 0 && <p className="text-slate-600">No seller applications found.</p>}

        {!loading && applications.length > 0 && (
          <SellerApplicationsTable
            applications={applications}
            onApprove={handleApprove}
            onReject={handleReject}
            adminUid={user.uid}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
