export interface SellerApplication {
  uid: string;
  ownerName: string;
  shopName: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string | null;
  approvedBy?: string | null;
  rejectedAt?: string | null;
  rejectedBy?: string | null;
  rejectionReason?: string | null;
}
