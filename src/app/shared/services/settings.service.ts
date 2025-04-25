import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { StoreSettings, ShippingSettings, PaymentSettings } from '../interfaces/settings.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  // بيانات وهمية للإعدادات
  private storeSettings: StoreSettings = {
    storeName: 'متجر الإلكترونيات',
    storeEmail: 'info@electronics-store.com',
    storePhone: '+966 12 345 6789',
    storeAddress: 'شارع الملك فهد',
    storeCity: 'الرياض',
    storeCountry: 'المملكة العربية السعودية',
    storeZipCode: '12345',
    storeCurrency: 'SAR',
    storeLanguage: 'ar',
    storeDescription: 'متجر إلكتروني متخصص في بيع الإلكترونيات والأجهزة الذكية',
    storeKeywords: 'إلكترونيات، هواتف ذكية، لابتوب، أجهزة ذكية',
    storeLogo: 'assets/img/logo.png',
    storeFacebook: 'https://facebook.com/electronics-store',
    storeTwitter: 'https://twitter.com/electronics-store',
    storeInstagram: 'https://instagram.com/electronics-store',
    storeLinkedIn: 'https://linkedin.com/company/electronics-store',
    storeYouTube: 'https://youtube.com/channel/electronics-store'
  };

  private shippingSettings: ShippingSettings = {
    enableShipping: true,
    shippingMethods: [
      { id: 1, name: 'توصيل عادي', cost: 20, isDefault: true, isActive: true },
      { id: 2, name: 'توصيل سريع', cost: 50, isDefault: false, isActive: true },
      { id: 3, name: 'استلام من المتجر', cost: 0, isDefault: false, isActive: true }
    ],
    freeShippingThreshold: 500
  };

  private paymentSettings: PaymentSettings = {
    enableCashOnDelivery: true,
    enableCreditCard: true,
    enablePayPal: false,
    enableBankTransfer: true,
    paymentInstructions: 'يرجى التأكد من إتمام عملية الدفع قبل إرسال الطلب',
    creditCardGateway: 'stripe',
    bankAccountDetails: 'بنك الراجحي - رقم الحساب: 123456789'
  };

  constructor(private http: HttpClient) { }

  /**
   * الحصول على إعدادات المتجر
   */
  getSettings(): Observable<StoreSettings> {
    // محاكاة طلب HTTP
    return of({ ...this.storeSettings }).pipe(delay(500));
  }

  /**
   * تحديث إعدادات المتجر
   */
  updateSettings(settings: StoreSettings): Observable<StoreSettings> {
    // محاكاة طلب HTTP
    this.storeSettings = { ...settings };
    return of(this.storeSettings).pipe(delay(500));
  }

  /**
   * رفع شعار المتجر
   */
  uploadLogo(file: File): Observable<{ logoUrl: string }> {
    // محاكاة طلب HTTP لرفع الملف
    // في التطبيق الحقيقي، سيتم رفع الملف إلى الخادم
    return of({ logoUrl: 'assets/img/logo-new.png' }).pipe(delay(1000));
  }

  /**
   * الحصول على إعدادات الشحن
   */
  getShippingSettings(): Observable<ShippingSettings> {
    // محاكاة طلب HTTP
    return of({ ...this.shippingSettings }).pipe(delay(500));
  }

  /**
   * تحديث إعدادات الشحن
   */
  updateShippingSettings(settings: ShippingSettings): Observable<ShippingSettings> {
    // محاكاة طلب HTTP
    this.shippingSettings = { ...settings };
    return of(this.shippingSettings).pipe(delay(500));
  }

  /**
   * الحصول على إعدادات الدفع
   */
  getPaymentSettings(): Observable<PaymentSettings> {
    // محاكاة طلب HTTP
    return of({ ...this.paymentSettings }).pipe(delay(500));
  }

  /**
   * تحديث إعدادات الدفع
   */
  updatePaymentSettings(settings: PaymentSettings): Observable<PaymentSettings> {
    // محاكاة طلب HTTP
    this.paymentSettings = { ...settings };
    return of(this.paymentSettings).pipe(delay(500));
  }
}
