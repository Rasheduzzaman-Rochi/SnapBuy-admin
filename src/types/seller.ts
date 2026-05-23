import type { DateValue } from './common';

export interface SellerApplication {
  uid: string;
  ownerName: string;
  shopName: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: DateValue;
  approvedAt?: DateValue;
  approvedBy?: string | null;
  rejectedAt?: DateValue;
  rejectedBy?: string | null;
  rejectionReason?: string | null;
}
