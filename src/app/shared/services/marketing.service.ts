import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, catchError, tap } from 'rxjs/operators';
import { Coupon } from '../interfaces/coupon.interface';
import { Promotion, PromotionProduct, PromotionCategory } from '../interfaces/promotion.interface';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketingService {
  // بيانات وهمية للكوبونات
  private coupons: Coupon[] = [
    {
      id: 1,
      code: 'WELCOME20',
      discountType: 'percentage',
      discountValue: 20,
      minOrderValue: 100,
      maxUses: 1000,
      usedCount: 450,
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      active: true
    },
    {
      id: 2,
      code: 'SUMMER30',
      discountType: 'percentage',
      discountValue: 30,
      minOrderValue: 200,
      maxUses: 500,
      usedCount: 320,
      startDate: '2023-06-01',
      endDate: '2023-08-31',
      active: true
    },
    {
      id: 3,
      code: 'FLAT50',
      discountType: 'fixed',
      discountValue: 50,
      minOrderValue: 300,
      maxUses: 200,
      usedCount: 150,
      startDate: '2023-03-01',
      endDate: '2023-03-31',
      active: false
    },
    {
      id: 4,
      code: 'NEWUSER15',
      discountType: 'percentage',
      discountValue: 15,
      minOrderValue: 0,
      maxUses: 0,
      usedCount: 1200,
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      active: true
    },
    {
      id: 5,
      code: 'FREESHIP',
      discountType: 'fixed',
      discountValue: 30,
      minOrderValue: 200,
      maxUses: 0,
      usedCount: 890,
      startDate: '2023-01-01',
      endDate: '2023-06-30',
      active: false
    }
  ];

  // بيانات وهمية للعروض الترويجية
  private promotions: Promotion[] = [
    {
      id: 1,
      title: 'خصم الصيف',
      description: 'خصم 25% على جميع الملابس الصيفية',
      discountType: 'percentage',
      discountValue: 25,
      minOrderValue: 0,
      startDate: '2023-06-01',
      endDate: '2023-08-31',
      categoryIds: [2, 5],
      active: true,
      featured: true,
      usageCount: 320,
      bannerImage: 'assets/img/promotions/summer-sale.jpg'
    },
    {
      id: 2,
      title: 'اشتر قطعتين واحصل على الثالثة مجاناً',
      description: 'عرض خاص على الإكسسوارات',
      discountType: 'buy_x_get_y',
      discountValue: 100,
      buyQuantity: 2,
      getQuantity: 1,
      minOrderValue: 0,
      startDate: '2023-07-15',
      endDate: '2023-09-15',
      categoryIds: [3],
      active: true,
      featured: false,
      usageCount: 145,
      bannerImage: 'assets/img/promotions/buy2get1.jpg'
    },
    {
      id: 3,
      title: 'خصم 50 ريال',
      description: 'خصم 50 ريال على الطلبات التي تزيد عن 300 ريال',
      discountType: 'fixed',
      discountValue: 50,
      minOrderValue: 300,
      startDate: '2023-05-01',
      endDate: '2023-05-31',
      active: false,
      featured: false,
      usageCount: 210,
      bannerImage: 'assets/img/promotions/fixed-discount.jpg'
    },
    {
      id: 4,
      title: 'عروض العودة للمدارس',
      description: 'خصومات تصل إلى 30% على مستلزمات المدرسة',
      discountType: 'percentage',
      discountValue: 30,
      minOrderValue: 0,
      startDate: '2023-08-15',
      endDate: '2023-09-15',
      categoryIds: [8],
      active: true,
      featured: true,
      usageCount: 180,
      bannerImage: 'assets/img/promotions/back-to-school.jpg'
    },
    {
      id: 5,
      title: 'عروض الجمعة البيضاء',
      description: 'خصومات تصل إلى 70% على جميع المنتجات',
      discountType: 'percentage',
      discountValue: 70,
      minOrderValue: 0,
      startDate: '2023-11-24',
      endDate: '2023-11-27',
      active: false,
      featured: true,
      usageCount: 0,
      bannerImage: 'assets/img/promotions/black-friday.jpg'
    }
  ];

  // بيانات وهمية للمنتجات
  private products: PromotionProduct[] = [
    { id: 1, name: 'قميص قطني', price: 120, image: 'assets/img/products/shirt1.jpg', category: 'ملابس رجالية' },
    { id: 2, name: 'بنطلون جينز', price: 150, image: 'assets/img/products/jeans1.jpg', category: 'ملابس رجالية' },
    { id: 3, name: 'فستان صيفي', price: 180, image: 'assets/img/products/dress1.jpg', category: 'ملابس نسائية' },
    { id: 4, name: 'حذاء رياضي', price: 220, image: 'assets/img/products/shoes1.jpg', category: 'أحذية' },
    { id: 5, name: 'حقيبة يد', price: 250, image: 'assets/img/products/bag1.jpg', category: 'إكسسوارات' },
    { id: 6, name: 'ساعة يد', price: 350, image: 'assets/img/products/watch1.jpg', category: 'إكسسوارات' },
    { id: 7, name: 'نظارة شمسية', price: 120, image: 'assets/img/products/sunglasses1.jpg', category: 'إكسسوارات' },
    { id: 8, name: 'حقيبة مدرسية', price: 180, image: 'assets/img/products/schoolbag1.jpg', category: 'مستلزمات مدرسية' }
  ];

  // بيانات وهمية للتصنيفات
  private categories: PromotionCategory[] = [
    { id: 1, name: 'ملابس رجالية', productCount: 15 },
    { id: 2, name: 'ملابس نسائية', productCount: 20 },
    { id: 3, name: 'إكسسوارات', productCount: 25 },
    { id: 4, name: 'أحذية', productCount: 12 },
    { id: 5, name: 'ملابس أطفال', productCount: 18 },
    { id: 6, name: 'إلكترونيات', productCount: 30 },
    { id: 7, name: 'منزل ومطبخ', productCount: 22 },
    { id: 8, name: 'مستلزمات مدرسية', productCount: 10 }
  ];

  constructor(private apiService: ApiService) { }

  /**
   * الحصول على جميع الكوبونات
   */
  getCoupons(): Observable<Coupon[]> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      return of([...this.coupons]).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.get<Coupon[]>('marketing/coupons').pipe(
      catchError(error => {
        console.error('Error fetching coupons:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        return of([...this.coupons]);
      })
    );
  }

  /**
   * الحصول على كوبون بواسطة المعرف
   */
  getCouponById(id: number): Observable<Coupon | undefined> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const coupon = this.coupons.find(c => c.id === id);
      return of(coupon).pipe(delay(300));
    }

    // استخدام API حقيقي
    return this.apiService.get<Coupon>(`marketing/coupons/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching coupon with id ${id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const coupon = this.coupons.find(c => c.id === id);
        return of(coupon);
      })
    );
  }

  /**
   * الحصول على كوبون بواسطة الكود
   */
  getCouponByCode(code: string): Observable<Coupon | undefined> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const coupon = this.coupons.find(c => c.code === code);
      return of(coupon).pipe(delay(300));
    }

    // استخدام API حقيقي
    return this.apiService.get<Coupon>(`marketing/coupons/code/${code}`).pipe(
      catchError(error => {
        console.error(`Error fetching coupon with code ${code}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const coupon = this.coupons.find(c => c.code === code);
        return of(coupon);
      })
    );
  }

  /**
   * إضافة كوبون جديد
   */
  addCoupon(coupon: Coupon): Observable<Coupon> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const newCoupon = {
        ...coupon,
        id: this.coupons.length + 1
      };
      this.coupons.push(newCoupon);
      return of(newCoupon).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.post<Coupon>('marketing/coupons', coupon).pipe(
      tap(newCoupon => {
        // إضافة الكوبون الجديد إلى الذاكرة المؤقتة
        this.coupons.push(newCoupon);
      }),
      catchError(error => {
        console.error('Error adding coupon:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const newCoupon = {
          ...coupon,
          id: this.coupons.length + 1
        };
        this.coupons.push(newCoupon);
        return of(newCoupon);
      })
    );
  }

  /**
   * تحديث كوبون موجود
   */
  updateCoupon(coupon: Coupon): Observable<Coupon> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const index = this.coupons.findIndex(c => c.id === coupon.id);
      if (index !== -1) {
        this.coupons[index] = { ...coupon };
      }
      return of(coupon).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.put<Coupon>(`marketing/coupons/${coupon.id}`, coupon).pipe(
      tap(updatedCoupon => {
        // تحديث الكوبون في الذاكرة المؤقتة
        const index = this.coupons.findIndex(c => c.id === updatedCoupon.id);
        if (index !== -1) {
          this.coupons[index] = updatedCoupon;
        }
      }),
      catchError(error => {
        console.error(`Error updating coupon with id ${coupon.id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const index = this.coupons.findIndex(c => c.id === coupon.id);
        if (index !== -1) {
          this.coupons[index] = { ...coupon };
        }
        return of(coupon);
      })
    );
  }

  /**
   * حذف كوبون
   */
  deleteCoupon(id: number): Observable<boolean> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const index = this.coupons.findIndex(c => c.id === id);
      if (index !== -1) {
        this.coupons.splice(index, 1);
        return of(true).pipe(delay(500));
      }
      return of(false).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.delete<any>(`marketing/coupons/${id}`).pipe(
      map(() => {
        // حذف الكوبون من الذاكرة المؤقتة
        const index = this.coupons.findIndex(c => c.id === id);
        if (index !== -1) {
          this.coupons.splice(index, 1);
        }
        return true;
      }),
      catchError(error => {
        console.error(`Error deleting coupon with id ${id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        return of(false);
      })
    );
  }

  /**
   * التحقق من صلاحية الكوبون
   */
  validateCoupon(code: string, orderAmount: number): Observable<{ valid: boolean; message: string; discount?: number }> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const coupon = this.coupons.find(c => c.code === code);

      if (!coupon) {
        return of({ valid: false, message: 'الكوبون غير موجود' }).pipe(delay(300));
      }

      if (!coupon.active) {
        return of({ valid: false, message: 'الكوبون غير نشط' }).pipe(delay(300));
      }

      const now = new Date();
      const startDate = new Date(coupon.startDate);
      const endDate = new Date(coupon.endDate);

      if (now < startDate || now > endDate) {
        return of({ valid: false, message: 'الكوبون منتهي الصلاحية' }).pipe(delay(300));
      }

      if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
        return of({ valid: false, message: 'تم استنفاد الحد الأقصى لاستخدام الكوبون' }).pipe(delay(300));
      }

      if (orderAmount < coupon.minOrderValue) {
        return of({ valid: false, message: `الحد الأدنى للطلب هو ${coupon.minOrderValue} ريال` }).pipe(delay(300));
      }

      let discount = 0;
      if (coupon.discountType === 'percentage') {
        discount = (orderAmount * coupon.discountValue) / 100;
      } else {
        discount = coupon.discountValue;
      }

      return of({ valid: true, message: 'الكوبون صالح', discount }).pipe(delay(300));
    }

    // استخدام API حقيقي
    return this.apiService.post<{ valid: boolean; message: string; discount?: number }>(
      'marketing/coupons/validate',
      { code, orderAmount }
    ).pipe(
      catchError(error => {
        console.error(`Error validating coupon ${code}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const coupon = this.coupons.find(c => c.code === code);
        if (!coupon) {
          return of({ valid: false, message: 'الكوبون غير موجود' });
        }

        // التحقق من صلاحية الكوبون محلياً
        if (!coupon.active) {
          return of({ valid: false, message: 'الكوبون غير نشط' });
        }

        const now = new Date();
        const startDate = new Date(coupon.startDate);
        const endDate = new Date(coupon.endDate);

        if (now < startDate || now > endDate) {
          return of({ valid: false, message: 'الكوبون منتهي الصلاحية' });
        }

        if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
          return of({ valid: false, message: 'تم استنفاد الحد الأقصى لاستخدام الكوبون' });
        }

        if (orderAmount < coupon.minOrderValue) {
          return of({ valid: false, message: `الحد الأدنى للطلب هو ${coupon.minOrderValue} ريال` });
        }

        let discount = 0;
        if (coupon.discountType === 'percentage') {
          discount = (orderAmount * coupon.discountValue) / 100;
        } else {
          discount = coupon.discountValue;
        }

        return of({ valid: true, message: 'الكوبون صالح', discount });
      })
    );
  }

  /**
   * الحصول على جميع العروض الترويجية
   */
  getPromotions(): Observable<Promotion[]> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      return of([...this.promotions]).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.get<Promotion[]>('marketing/promotions').pipe(
      catchError(error => {
        console.error('Error fetching promotions:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        return of([...this.promotions]);
      })
    );
  }

  /**
   * الحصول على عرض ترويجي بواسطة المعرف
   */
  getPromotionById(id: number): Observable<Promotion | undefined> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const promotion = this.promotions.find(p => p.id === id);
      return of(promotion).pipe(delay(300));
    }

    // استخدام API حقيقي
    return this.apiService.get<Promotion>(`marketing/promotions/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching promotion with id ${id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const promotion = this.promotions.find(p => p.id === id);
        return of(promotion);
      })
    );
  }

  /**
   * إضافة عرض ترويجي جديد
   */
  addPromotion(promotion: Omit<Promotion, 'id' | 'usageCount'>): Observable<Promotion> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const newPromotion: Promotion = {
        ...promotion,
        id: this.promotions.length + 1,
        usageCount: 0
      };
      this.promotions.push(newPromotion);
      return of(newPromotion).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.post<Promotion>('marketing/promotions', promotion).pipe(
      tap(newPromotion => {
        // إضافة العرض الترويجي الجديد إلى الذاكرة المؤقتة
        this.promotions.push(newPromotion);
      }),
      catchError(error => {
        console.error('Error adding promotion:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const newPromotion: Promotion = {
          ...promotion,
          id: this.promotions.length + 1,
          usageCount: 0
        };
        this.promotions.push(newPromotion);
        return of(newPromotion);
      })
    );
  }

  /**
   * تحديث عرض ترويجي موجود
   */
  updatePromotion(promotion: Promotion): Observable<Promotion> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const index = this.promotions.findIndex(p => p.id === promotion.id);
      if (index !== -1) {
        this.promotions[index] = { ...promotion };
      }
      return of(promotion).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.put<Promotion>(`marketing/promotions/${promotion.id}`, promotion).pipe(
      tap(updatedPromotion => {
        // تحديث العرض الترويجي في الذاكرة المؤقتة
        const index = this.promotions.findIndex(p => p.id === updatedPromotion.id);
        if (index !== -1) {
          this.promotions[index] = updatedPromotion;
        }
      }),
      catchError(error => {
        console.error(`Error updating promotion with id ${promotion.id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const index = this.promotions.findIndex(p => p.id === promotion.id);
        if (index !== -1) {
          this.promotions[index] = { ...promotion };
        }
        return of(promotion);
      })
    );
  }

  /**
   * حذف عرض ترويجي
   */
  deletePromotion(id: number): Observable<boolean> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const index = this.promotions.findIndex(p => p.id === id);
      if (index !== -1) {
        this.promotions.splice(index, 1);
        return of(true).pipe(delay(500));
      }
      return of(false).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.delete<any>(`marketing/promotions/${id}`).pipe(
      map(() => {
        // حذف العرض الترويجي من الذاكرة المؤقتة
        const index = this.promotions.findIndex(p => p.id === id);
        if (index !== -1) {
          this.promotions.splice(index, 1);
        }
        return true;
      }),
      catchError(error => {
        console.error(`Error deleting promotion with id ${id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        return of(false);
      })
    );
  }

  /**
   * تغيير حالة العرض الترويجي
   */
  togglePromotionStatus(id: number, active: boolean): Observable<Promotion | undefined> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const promotion = this.promotions.find(p => p.id === id);
      if (promotion) {
        promotion.active = active;
        return of(promotion).pipe(delay(300));
      }
      return of(undefined).pipe(delay(300));
    }

    // استخدام API حقيقي
    return this.apiService.patch<Promotion>(`marketing/promotions/${id}/status`, { active }).pipe(
      tap(updatedPromotion => {
        // تحديث العرض الترويجي في الذاكرة المؤقتة
        const index = this.promotions.findIndex(p => p.id === updatedPromotion.id);
        if (index !== -1) {
          this.promotions[index] = updatedPromotion;
        }
      }),
      catchError(error => {
        console.error(`Error updating promotion status with id ${id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const promotion = this.promotions.find(p => p.id === id);
        if (promotion) {
          promotion.active = active;
          return of(promotion);
        }
        return of(undefined);
      })
    );
  }

  /**
   * تغيير حالة العرض المميز
   */
  togglePromotionFeatured(id: number, featured: boolean): Observable<Promotion | undefined> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const promotion = this.promotions.find(p => p.id === id);
      if (promotion) {
        promotion.featured = featured;
        return of(promotion).pipe(delay(300));
      }
      return of(undefined).pipe(delay(300));
    }

    // استخدام API حقيقي
    return this.apiService.patch<Promotion>(`marketing/promotions/${id}/featured`, { featured }).pipe(
      tap(updatedPromotion => {
        // تحديث العرض الترويجي في الذاكرة المؤقتة
        const index = this.promotions.findIndex(p => p.id === updatedPromotion.id);
        if (index !== -1) {
          this.promotions[index] = updatedPromotion;
        }
      }),
      catchError(error => {
        console.error(`Error updating promotion featured status with id ${id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const promotion = this.promotions.find(p => p.id === id);
        if (promotion) {
          promotion.featured = featured;
          return of(promotion);
        }
        return of(undefined);
      })
    );
  }

  /**
   * الحصول على جميع المنتجات
   */
  getProducts(): Observable<PromotionProduct[]> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      return of([...this.products]).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.get<PromotionProduct[]>('marketing/products').pipe(
      catchError(error => {
        console.error('Error fetching products for promotions:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        return of([...this.products]);
      })
    );
  }

  /**
   * الحصول على جميع التصنيفات
   */
  getCategories(): Observable<PromotionCategory[]> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      return of([...this.categories]).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.get<PromotionCategory[]>('marketing/categories').pipe(
      catchError(error => {
        console.error('Error fetching categories for promotions:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        return of([...this.categories]);
      })
    );
  }

  /**
   * الحصول على المنتجات حسب التصنيف
   */
  getProductsByCategory(categoryId: number): Observable<PromotionProduct[]> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const category = this.categories.find(c => c.id === categoryId);
      if (!category) {
        return of([]).pipe(delay(300));
      }

      const filteredProducts = this.products.filter(p => p.category === category.name);
      return of(filteredProducts).pipe(delay(300));
    }

    // استخدام API حقيقي
    return this.apiService.get<PromotionProduct[]>(`marketing/categories/${categoryId}/products`).pipe(
      catchError(error => {
        console.error(`Error fetching products for category ${categoryId}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const category = this.categories.find(c => c.id === categoryId);
        if (!category) {
          return of([]);
        }
        const filteredProducts = this.products.filter(p => p.category === category.name);
        return of(filteredProducts);
      })
    );
  }
}
