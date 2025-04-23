import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../shared/interfaces/product.interface';
import { CategoryService } from '../../shared/services/category.service';
import { CartService } from '../../shared/services/cart.service';
import { WishlistService } from '../../shared/services/wishlist.service';

type ViewMode = 'grid' | 'list';
type SortOption = 'default' | 'priceAsc' | 'priceDesc' | 'ratingDesc' | 'discountDesc';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  allProducts: Product[] = [
    // إلكترونيات - تصنيف 1
    {
      id: 1,
      name: 'هاتف سامسونج جالكسي S23',
      description: 'هاتف ذكي حديث مع كاميرا متطورة وأداء فائق',
      price: 3499.99,
      imageUrl: 'assets/img/products/phone-1.jpg',
      category: '1',
      inStock: true,
      rating: 4.8,
      discount: 10
    },
    {
      id: 2,
      name: 'لابتوب ماك بوك برو',
      description: 'معالج M2 مع شاشة 14 بوصة عالية الدقة',
      price: 4999.99,
      imageUrl: 'assets/img/products/laptop-1.jpg',
      category: '1',
      inStock: true,
      rating: 4.9
    },
    {
      id: 3,
      name: 'سماعات آبل إيربودز برو',
      description: 'سماعات لاسلكية مع خاصية إلغاء الضوضاء',
      price: 899.99,
      imageUrl: 'assets/img/products/airpods.jpg',
      category: '1',
      inStock: true,
      rating: 4.7,
      discount: 15
    },
    // ملابس - تصنيف 2
    {
      id: 4,
      name: 'قميص رجالي كلاسيك',
      description: 'قميص قطني بتصميم أنيق مناسب للعمل',
      price: 199.99,
      imageUrl: 'assets/img/products/shirt-1.jpg',
      category: '2',
      inStock: true,
      rating: 4.5
    },
    {
      id: 5,
      name: 'فستان نسائي صيفي',
      description: 'فستان خفيف بألوان زاهية مناسب للصيف',
      price: 299.99,
      imageUrl: 'assets/img/products/dress-1.jpg',
      category: '2',
      inStock: true,
      rating: 4.6,
      discount: 20
    },
    // أثاث منزلي - تصنيف 3
    {
      id: 6,
      name: 'أريكة جلدية ثلاثية',
      description: 'أريكة فاخرة مريحة مناسبة لغرفة المعيشة',
      price: 2999.99,
      imageUrl: 'assets/img/products/sofa-1.jpg',
      category: '3',
      inStock: true,
      rating: 4.4
    },
    {
      id: 7,
      name: 'طاولة طعام خشبية',
      description: 'طاولة طعام لـ 6 أشخاص من خشب الزان',
      price: 1499.99,
      imageUrl: 'assets/img/products/table-1.jpg',
      category: '3',
      inStock: true,
      rating: 4.3,
      discount: 15
    },
    // مستلزمات رياضية - تصنيف 4
    {
      id: 8,
      name: 'جهاز مشي كهربائي',
      description: 'جهاز مشي احترافي مع شاشة ذكية',
      price: 3999.99,
      imageUrl: 'assets/img/products/treadmill-1.jpg',
      category: '4',
      inStock: true,
      rating: 4.7
    },
    {
      id: 9,
      name: 'مجموعة أوزان متنوعة',
      description: 'مجموعة أوزان حديد مع حامل',
      price: 799.99,
      imageUrl: 'assets/img/products/weights-1.jpg',
      category: '4',
      inStock: true,
      rating: 4.5,
      discount: 10
    },
    // كتب - تصنيف 5
    {
      id: 10,
      name: 'تعلم Angular بسهولة',
      description: 'كتاب شامل لتعلم تطوير تطبيقات الويب',
      price: 149.99,
      imageUrl: 'assets/img/products/book-1.jpg',
      category: '5',
      inStock: true,
      rating: 4.8
    },
    {
      id: 11,
      name: 'رواية ألف شمس مشرقة',
      description: 'رواية عالمية مترجمة للعربية',
      price: 79.99,
      imageUrl: 'assets/img/products/book-2.jpg',
      category: '5',
      inStock: true,
      rating: 4.9,
      discount: 5
    },
    // مستلزمات منزلية - تصنيف 6
    {
      id: 12,
      name: 'خلاط كهربائي محترف',
      description: 'خلاط متعدد السرعات بسعة 2 لتر',
      price: 399.99,
      imageUrl: 'assets/img/products/blender-1.jpg',
      category: '6',
      inStock: true,
      rating: 4.6
    },
    {
      id: 13,
      name: 'طقم أواني طهي',
      description: 'طقم أواني تيفال 10 قطع',
      price: 899.99,
      imageUrl: 'assets/img/products/cookware-1.jpg',
      category: '6',
      inStock: true,
      rating: 4.7,
      discount: 25
    }
  ];

  products: Product[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';
  sortBy: SortOption = 'default';
  viewMode: ViewMode = 'grid';

  // نطاق السعر والتقييم
  priceRange = {
    min: 0,
    max: 5000
  };
  ratingFilter = 0;

  // فلاتر إضافية
  showOnlyInStock: boolean = false;
  showOnlyDiscounted: boolean = false;

  // منتجات المقارنة
  compareProducts: Product[] = [];
  maxCompareItems: number = 3;

  sortOptions = [
    { value: 'default', label: 'الترتيب الافتراضي' },
    { value: 'priceAsc', label: 'السعر: من الأقل إلى الأعلى' },
    { value: 'priceDesc', label: 'السعر: من الأعلى إلى الأقل' },
    { value: 'ratingDesc', label: 'التقييم: من الأعلى إلى الأقل' },
    { value: 'discountDesc', label: 'الخصم: من الأعلى إلى الأقل' }
  ];

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const categoryId = params['category'];
      if (categoryId) {
        this.selectedCategory = categoryId;
        this.filterProducts();
      } else {
        this.products = [...this.allProducts];
      }
    });
  }

  filterProducts(): void {
    this.products = this.allProducts.filter(product => {
      const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;
      const matchesSearch = !this.searchQuery ||
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesInStock = !this.showOnlyInStock || product.inStock;
      const matchesDiscount = !this.showOnlyDiscounted || (product.discount && product.discount > 0);
      const matchesPrice = this.getFinalPrice(product) >= this.priceRange.min &&
                          this.getFinalPrice(product) <= this.priceRange.max;
      const matchesRating = !this.ratingFilter || (product.rating && product.rating >= this.ratingFilter);

      return matchesCategory && matchesSearch && matchesInStock &&
             matchesDiscount && matchesPrice && matchesRating;
    });

    this.sortProducts();
  }

  sortProducts(): void {
    switch (this.sortBy) {
      case 'priceAsc':
        this.products.sort((a, b) => this.getFinalPrice(a) - this.getFinalPrice(b));
        break;
      case 'priceDesc':
        this.products.sort((a, b) => this.getFinalPrice(b) - this.getFinalPrice(a));
        break;
      case 'ratingDesc':
        this.products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'discountDesc':
        this.products.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        this.products = this.products.sort((a, b) => a.id - b.id);
        break;
    }
  }

  getFinalPrice(product: Product): number {
    return product.discount ?
      product.price * (1 - product.discount / 100) :
      product.price;
  }

  onSortChange(): void {
    this.sortProducts();
  }

  onSearchChange(): void {
    this.filterProducts();
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterProducts();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  toggleCompare(product: Product): void {
    const index = this.compareProducts.findIndex(p => p.id === product.id);
    if (index === -1) {
      if (this.compareProducts.length < this.maxCompareItems) {
        this.compareProducts.push(product);
      }
    } else {
      this.compareProducts.splice(index, 1);
    }
  }

  isInCompare(productId: number): boolean {
    return this.compareProducts.some(p => p.id === productId);
  }

  clearCompare(): void {
    this.compareProducts = [];
  }

  removeFromCompare(productId: number): void {
    this.compareProducts = this.compareProducts.filter(p => p.id !== productId);
  }

  canAddToCompare(): boolean {
    return this.compareProducts.length < this.maxCompareItems;
  }

  toggleWishlist(product: Product): void {
    if (this.isInWishlist(product.id)) {
      this.wishlistService.removeFromWishlist(product.id);
    } else {
      this.wishlistService.addToWishlist(product);
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }
}
