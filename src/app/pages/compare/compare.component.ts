import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../shared/interfaces/product.interface';
import { CartService } from '../../shared/services/cart.service';
import { WishlistService } from '../../shared/services/wishlist.service';

type CategoryMap = {
  [key: string]: string;
};

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {
  compareProducts: Product[] = [];
  features: string[] = [
    'السعر الأساسي',
    'السعر بعد الخصم',
    'التقييم',
    'التوفر',
    'نسبة الخصم',
    'الوصف',
    'التصنيف',
    'عدد المشترين',
    'الضمان',
    'خدمة التوصيل',
    'إمكانية الإرجاع'
  ];

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    const savedCompare = localStorage.getItem('compareProducts');
    if (savedCompare) {
      this.compareProducts = JSON.parse(savedCompare);
    }
  }

  removeProduct(productId: number): void {
    this.compareProducts = this.compareProducts.filter(p => p.id !== productId);
    this.saveToStorage();
  }

  clearCompare(): void {
    this.compareProducts = [];
    localStorage.removeItem('compareProducts');
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  addToWishlist(product: Product): void {
    this.wishlistService.addToWishlist(product);
  }

  shareProduct(product: Product): void {
    const text = `تحقق من ${product.name} على متجرنا`;
    const url = window.location.origin + '/products?id=' + product.id;

    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: text,
        url: url
      });
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('compareProducts', JSON.stringify(this.compareProducts));
  }

  getFeatureValue(product: Product, feature: string): string {
    switch (feature) {
      case 'السعر الأساسي':
        return `${product.price} ريال`;
      case 'السعر بعد الخصم':
        return product.discount ?
          `${product.price * (1 - product.discount/100)} ريال` :
          'لا يوجد خصم';
      case 'التقييم':
        return product.rating ? `${product.rating}/5` : 'غير متوفر';
      case 'التوفر':
        return product.inStock ? 'متوفر' : 'غير متوفر';
      case 'نسبة الخصم':
        return product.discount ? `${product.discount}%` : 'لا يوجد خصم';
      case 'الوصف':
        return product.description;
      case 'التصنيف':
        return this.getCategoryName(product.category);
      case 'عدد المشترين':
        return '100+'; // قيمة افتراضية
      case 'الضمان':
        return 'سنة واحدة'; // قيمة افتراضية
      case 'خدمة التوصيل':
        return 'متوفرة'; // قيمة افتراضية
      case 'إمكانية الإرجاع':
        return '14 يوم'; // قيمة افتراضية
      default:
        return '';
    }
  }

  private getCategoryName(categoryId: string): string {
    const categories: CategoryMap = {
      '1': 'إلكترونيات',
      '2': 'ملابس',
      '3': 'أثاث منزلي',
      '4': 'مستلزمات رياضية',
      '5': 'كتب',
      '6': 'مستلزمات منزلية'
    };
    return categories[categoryId] || 'غير محدد';
  }

  isHighlightedFeature(feature: string): boolean {
    const highlightedFeatures = [
      'السعر بعد الخصم',
      'التقييم',
      'نسبة الخصم',
      'الضمان',
      'إمكانية الإرجاع'
    ];
    return highlightedFeatures.includes(feature);
  }
}
