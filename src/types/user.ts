import type { DateValue } from './common';

export interface User {
  uid: string;
  name: string;
  email: string;
  mobile?: string;
  phone: string;
  provider: string;
  accountType?: string;
  sellerStatus?: string;
  isSeller?: boolean;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: DateValue;
  updatedAt?: DateValue;
}
