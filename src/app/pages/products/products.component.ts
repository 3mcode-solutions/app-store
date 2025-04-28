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
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&h=400&auto=format&fit=crop',
      category: '1',
      subCategory: '2',
      inStock: true,
      rating: 4.8,
      discount: 10
    },
    {
      id: 2,
      name: 'لابتوب ماك بوك برو',
      description: 'معالج M2 مع شاشة 14 بوصة عالية الدقة',
      price: 4999.99,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&h=400&auto=format&fit=crop',
      category: '1',
      subCategory: '3',
      inStock: true,
      rating: 4.9
    },
    {
      id: 3,
      name: 'سماعات آبل إيربودز برو',
      description: 'سماعات لاسلكية مع خاصية إلغاء الضوضاء',
      price: 899.99,
      imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600&h=400&auto=format&fit=crop',
      category: '1',
      subCategory: '3',
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
      imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&h=400&auto=format&fit=crop',
      category: '2',
      subCategory: '5',
      inStock: true,
      rating: 4.5
    },
    {
      id: 5,
      name: 'فستان نسائي صيفي',
      description: 'فستان خفيف بألوان زاهية مناسب للصيف',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=600&h=400&auto=format&fit=crop',
      category: '2',
      subCategory: '6',
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
  selectedSubCategory: string = '';
  sortBy: SortOption = 'default';
  viewMode: ViewMode = 'grid';

  // قائمة التصنيفات والتصنيفات الفرعية
  categories: any[] = [];
  subCategories: any[] = [];

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
    // تحميل التصنيفات
    this.loadCategories();

    // استمع للتغييرات في المسار
    this.route.data.subscribe(data => {
      if (data['category']) {
        // إذا كان هناك فئة محددة في بيانات المسار
        this.filterByCategory(data['category']);
      } else {
        // استمع لمعلمات الاستعلام
        this.route.queryParams.subscribe(params => {
          const categoryId = params['category'];
          const categorySlug = params['categorySlug'];
          const subCategoryId = params['subCategory'];

          if (categorySlug) {
            // البحث عن التصنيف بواسطة الرابط المختصر
            this.findCategoryBySlug(categorySlug);
          } else if (categoryId) {
            this.selectedCategory = categoryId;
            this.loadSubCategories(categoryId);

            if (subCategoryId) {
              this.selectedSubCategory = subCategoryId;
            }

            this.filterProducts();
          } else {
            this.products = [...this.allProducts];
          }
        });
      }
    });
  }

  /**
   * تحميل التصنيفات من الخدمة
   */
  loadCategories(): void {
    this.categoryService.getParentCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  /**
   * تحميل التصنيفات الفرعية لتصنيف معين
   */
  loadSubCategories(categoryId: string): void {
    if (!categoryId) {
      this.subCategories = [];
      return;
    }

    this.categoryService.getSubCategories(parseInt(categoryId)).subscribe({
      next: (subCategories) => {
        this.subCategories = subCategories;
      },
      error: (error) => {
        console.error(`Error loading subcategories for category ${categoryId}:`, error);
        this.subCategories = [];
      }
    });
  }

  /**
   * البحث عن تصنيف بواسطة الرابط المختصر
   */
  findCategoryBySlug(slug: string): void {
    this.categoryService.getCategoryBySlug(slug).subscribe({
      next: (category) => {
        if (category) {
          this.selectedCategory = category.id.toString();

          if (category.isParent) {
            this.loadSubCategories(this.selectedCategory);
          } else if (category.parentId) {
            this.selectedCategory = category.parentId.toString();
            this.selectedSubCategory = category.id.toString();
            this.loadSubCategories(this.selectedCategory);
          }

          this.filterProducts();
        } else {
          this.products = [...this.allProducts];
        }
      },
      error: (error) => {
        console.error(`Error finding category by slug ${slug}:`, error);
        this.products = [...this.allProducts];
      }
    });
  }

  /**
   * تصفية المنتجات حسب الفئة
   */
  filterByCategory(categoryName: string): void {
    // تعيين الفئة المحددة بناءً على اسم الفئة
    switch (categoryName) {
      case 'electronics':
        this.selectedCategory = '1';
        break;
      case 'clothing':
        this.selectedCategory = '2';
        break;
      case 'furniture':
        this.selectedCategory = '3';
        break;
      case 'sports':
        this.selectedCategory = '4';
        break;
      default:
        this.selectedCategory = '';
    }

    // تطبيق التصفية
    this.filterProducts();
  }

  filterProducts(): void {
    this.products = this.allProducts.filter(product => {
      // تصفية حسب التصنيف الرئيسي
      const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;

      // تصفية حسب التصنيف الفرعي
      const matchesSubCategory = !this.selectedSubCategory || product.subCategory === this.selectedSubCategory;

      // تصفية حسب البحث
      const matchesSearch = !this.searchQuery ||
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      // تصفية حسب المخزون
      const matchesInStock = !this.showOnlyInStock || product.inStock;

      // تصفية حسب الخصم
      const matchesDiscount = !this.showOnlyDiscounted || (product.discount && product.discount > 0);

      // تصفية حسب السعر
      const matchesPrice = this.getFinalPrice(product) >= this.priceRange.min &&
                          this.getFinalPrice(product) <= this.priceRange.max;

      // تصفية حسب التقييم
      const matchesRating = !this.ratingFilter || (product.rating && product.rating >= this.ratingFilter);

      // تطبيق جميع الفلاتر
      return matchesCategory && matchesSubCategory && matchesSearch && matchesInStock &&
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
    this.selectedSubCategory = '';

    // تحميل التصنيفات الفرعية للتصنيف المحدد
    if (categoryId) {
      this.loadSubCategories(categoryId);
    } else {
      this.subCategories = [];
    }

    this.filterProducts();
  }

  /**
   * معالجة تغيير التصنيف الفرعي
   */
  onSubCategoryChange(subCategoryId: string): void {
    this.selectedSubCategory = subCategoryId;
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
