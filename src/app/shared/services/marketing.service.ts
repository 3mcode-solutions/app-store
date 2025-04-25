import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Coupon } from '../interfaces/coupon.interface';

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

  constructor(private http: HttpClient) { }

  /**
   * الحصول على جميع الكوبونات
   */
  getCoupons(): Observable<Coupon[]> {
    // محاكاة طلب HTTP
    return of([...this.coupons]).pipe(delay(500));
  }

  /**
   * الحصول على كوبون بواسطة المعرف
   */
  getCouponById(id: number): Observable<Coupon | undefined> {
    // محاكاة طلب HTTP
    const coupon = this.coupons.find(c => c.id === id);
    return of(coupon).pipe(delay(300));
  }

  /**
   * الحصول على كوبون بواسطة الكود
   */
  getCouponByCode(code: string): Observable<Coupon | undefined> {
    // محاكاة طلب HTTP
    const coupon = this.coupons.find(c => c.code === code);
    return of(coupon).pipe(delay(300));
  }

  /**
   * إضافة كوبون جديد
   */
  addCoupon(coupon: Coupon): Observable<Coupon> {
    // محاكاة طلب HTTP
    const newCoupon = {
      ...coupon,
      id: this.coupons.length + 1
    };
    this.coupons.push(newCoupon);
    return of(newCoupon).pipe(delay(500));
  }

  /**
   * تحديث كوبون موجود
   */
  updateCoupon(coupon: Coupon): Observable<Coupon> {
    // محاكاة طلب HTTP
    const index = this.coupons.findIndex(c => c.id === coupon.id);
    if (index !== -1) {
      this.coupons[index] = { ...coupon };
    }
    return of(coupon).pipe(delay(500));
  }

  /**
   * حذف كوبون
   */
  deleteCoupon(id: number): Observable<boolean> {
    // محاكاة طلب HTTP
    const index = this.coupons.findIndex(c => c.id === id);
    if (index !== -1) {
      this.coupons.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  /**
   * التحقق من صلاحية الكوبون
   */
  validateCoupon(code: string, orderAmount: number): Observable<{ valid: boolean; message: string; discount?: number }> {
    // محاكاة طلب HTTP
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
}
