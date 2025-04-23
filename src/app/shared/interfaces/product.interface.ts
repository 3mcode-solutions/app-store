export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  quantity?: number;
  rating?: number;
  discount?: number;
}
