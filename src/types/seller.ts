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
}
