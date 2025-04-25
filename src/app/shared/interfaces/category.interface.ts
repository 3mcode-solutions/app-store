export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  productCount: number;
  icon?: string;
  isActive?: boolean;
}
