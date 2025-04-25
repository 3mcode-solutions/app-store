export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  quantity?: number;
  stockQuantity?: number;
  featured?: boolean;
  rating?: number;
  discount?: number;
}
