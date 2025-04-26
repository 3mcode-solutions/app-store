import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, catchError, tap } from 'rxjs/operators';
import { Product } from '../interfaces/product.interface';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
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

  constructor(private apiService: ApiService) { }

  /**
   * الحصول على جميع المنتجات
   */
  getProducts(): Observable<Product[]> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      return of([...this.products]).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.get<Product[]>('products').pipe(
      catchError(error => {
        console.error('Error fetching products:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        return of([...this.products]);
      })
    );
  }

  /**
   * الحصول على منتج بواسطة المعرف
   */
  getProductById(id: number): Observable<Product | undefined> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const product = this.products.find(p => p.id === id);
      return of(product).pipe(delay(300));
    }

    // استخدام API حقيقي
    return this.apiService.get<Product>(`products/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching product with id ${id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const product = this.products.find(p => p.id === id);
        return of(product);
      })
    );
  }

  /**
   * الحصول على المنتجات حسب الفئة
   */
  getProductsByCategory(categoryId: string): Observable<Product[]> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const filteredProducts = this.products.filter(p => p.category === categoryId);
      return of(filteredProducts).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.get<Product[]>('products', { params: { categoryId } }).pipe(
      catchError(error => {
        console.error(`Error fetching products for category ${categoryId}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const filteredProducts = this.products.filter(p => p.category === categoryId);
        return of(filteredProducts);
      })
    );
  }

  /**
   * إضافة منتج جديد
   */
  addProduct(product: Product): Observable<Product> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      // إنشاء معرف جديد
      const newId = Math.max(...this.products.map(p => p.id)) + 1;
      const newProduct = { ...product, id: newId };

      // إضافة المنتج إلى المصفوفة
      this.products.push(newProduct);

      return of(newProduct).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.post<Product>('products', product).pipe(
      tap(newProduct => {
        // إضافة المنتج الجديد إلى الذاكرة المؤقتة
        this.products.push(newProduct);
      }),
      catchError(error => {
        console.error('Error adding product:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const newId = Math.max(...this.products.map(p => p.id)) + 1;
        const newProduct = { ...product, id: newId };
        this.products.push(newProduct);
        return of(newProduct);
      })
    );
  }

  /**
   * تحديث منتج موجود
   */
  updateProduct(product: Product): Observable<Product> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      // البحث عن المنتج وتحديثه
      const index = this.products.findIndex(p => p.id === product.id);

      if (index !== -1) {
        this.products[index] = { ...product };
        return of(this.products[index]).pipe(delay(500));
      }

      // إذا لم يتم العثور على المنتج
      return of(product).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.put<Product>(`products/${product.id}`, product).pipe(
      tap(updatedProduct => {
        // تحديث المنتج في الذاكرة المؤقتة
        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
      }),
      catchError(error => {
        console.error(`Error updating product with id ${product.id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products[index] = { ...product };
          return of(this.products[index]);
        }
        return of(product);
      })
    );
  }

  /**
   * حذف منتج
   */
  deleteProduct(id: number): Observable<boolean> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const initialLength = this.products.length;
      this.products = this.products.filter(p => p.id !== id);

      // التحقق من نجاح الحذف
      const success = initialLength > this.products.length;

      return of(success).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.delete<any>(`products/${id}`).pipe(
      map(() => {
        // حذف المنتج من الذاكرة المؤقتة
        this.products = this.products.filter(p => p.id !== id);
        return true;
      }),
      catchError(error => {
        console.error(`Error deleting product with id ${id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        return of(false);
      })
    );
  }

  /**
   * البحث عن منتجات
   */
  searchProducts(query: string): Observable<Product[]> {
    if (!query.trim()) {
      return of([]);
    }

    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const searchTerm = query.toLowerCase();
      const results = this.products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );

      return of(results).pipe(delay(300));
    }

    // استخدام API حقيقي
    return this.apiService.get<Product[]>('products/search', { params: { query } }).pipe(
      catchError(error => {
        console.error(`Error searching products with query "${query}":`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const searchTerm = query.toLowerCase();
        const results = this.products.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
        );
        return of(results);
      })
    );
  }

  /**
   * الحصول على المنتجات المخفضة
   */
  getDiscountedProducts(): Observable<Product[]> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const discountedProducts = this.products.filter(p => p.discount && p.discount > 0);
      return of(discountedProducts).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.get<Product[]>('products/discounted').pipe(
      catchError(error => {
        console.error('Error fetching discounted products:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const discountedProducts = this.products.filter(p => p.discount && p.discount > 0);
        return of(discountedProducts);
      })
    );
  }

  /**
   * الحصول على المنتجات الأكثر مبيعاً
   */
  getTopSellingProducts(limit: number = 5): Observable<Product[]> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      // هنا نقوم بمحاكاة المنتجات الأكثر مبيعاً عن طريق ترتيب المنتجات حسب التقييم
      const topProducts = [...this.products]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit);

      return of(topProducts).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.get<Product[]>('products/top-selling', { params: { limit: limit.toString() } }).pipe(
      catchError(error => {
        console.error('Error fetching top selling products:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const topProducts = [...this.products]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, limit);
        return of(topProducts);
      })
    );
  }
}
