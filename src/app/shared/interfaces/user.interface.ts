export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  address?: Address;
  createdAt: Date;
  lastLogin?: Date;
  isVerified: boolean;
  notes?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export enum UserRole {
  Admin = 'admin',
  Customer = 'customer',
  Editor = 'editor',
  Vendor = 'vendor'
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Suspended = 'suspended',
  Pending = 'pending'
}
