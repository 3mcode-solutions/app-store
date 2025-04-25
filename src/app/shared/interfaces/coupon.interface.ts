export interface Coupon {
  id: number;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxUses: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  active: boolean;
}
