export interface ProductImage {
  id: number;
  url: string;
  isMain: boolean;
  alt?: string;
}

export interface ProductVariant {
  id: number;
  name: string;
  price?: number;
  stockQuantity?: number;
  sku?: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

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

  // خصائص جديدة
  sku?: string;
  barcode?: string;
  weight?: number;
  weightUnit?: 'kg' | 'g';
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'm';
  };
  brand?: string;
  tags?: string[];
  attributes?: ProductAttribute[];
  images?: ProductImage[];
  variants?: ProductVariant[];
  relatedProductIds?: number[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  isDigital?: boolean;
  downloadLink?: string;
  taxRate?: number;
  shippingRequired?: boolean;
}
