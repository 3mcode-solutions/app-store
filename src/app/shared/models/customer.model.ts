export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  registrationDate: Date;
  lastLoginDate?: Date;
  totalOrders: number;
  totalSpent: number;
  groupId?: number;
  groupName?: string;
  status: 'active' | 'inactive' | 'blocked';
  notes?: string;
  avatar?: string;
}

export interface CustomerGroup {
  id: number;
  name: string;
  description: string;
  discount: number;
  membersCount: number;
  createdAt: Date;
  updatedAt?: Date;
  status: 'active' | 'inactive';
}
