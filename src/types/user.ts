import type { DateValue } from './common';

export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  provider: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: DateValue;
}
