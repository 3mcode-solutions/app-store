export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  icon: string;
  slug: string;
  displayOrder: number;
  isParent: boolean;
  parentId?: number;
  active: boolean;
  productCount: number;
  subCategories?: Category[];
}
