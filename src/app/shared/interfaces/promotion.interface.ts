export interface Promotion {
  id: number;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'buy_x_get_y';
  discountValue: number;
  buyQuantity?: number;
  getQuantity?: number;
  minOrderValue: number;
  startDate: string;
  endDate: string;
  productIds?: number[];
  categoryIds?: number[];
  active: boolean;
  featured: boolean;
  usageCount: number;
  bannerImage?: string;
}

export interface PromotionProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface PromotionCategory {
  id: number;
  name: string;
  productCount: number;
}
