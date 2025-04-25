import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from '../../shared/services/toastr.service';

declare var bootstrap: any;

interface StoreSettings {
  general: {
    storeName: string;
    storeEmail: string;
    storePhone: string;
    storeAddress: string;
    storeLogo: string;
    storeFavicon: string;
    storeDescription: string;
    storeKeywords: string;
    storeCurrency: string;
    storeLanguage: string;
    storeTimeZone: string;
  };
  shipping: {
    enableShipping: boolean;
    shippingMethods: {
      id: number;
      name: string;
      cost: number;
      isDefault: boolean;
      isActive: boolean;
    }[];
    freeShippingThreshold: number;
  };
  payment: {
    enableCashOnDelivery: boolean;
    enableCreditCard: boolean;
    enablePayPal: boolean;
    enableBankTransfer: boolean;
    paymentInstructions: string;
  };
  tax: {
    enableTax: boolean;
    taxRate: number;
    includeTaxInPrice: boolean;
  };
  email: {
    smtpServer: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    smtpEncryption: string;
    senderName: string;
    senderEmail: string;
  };
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    googleAnalyticsId: string;
  };
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  // النماذج
  generalForm: FormGroup;
  shippingForm: FormGroup;
  paymentForm: FormGroup;
  taxForm: FormGroup;
  emailForm: FormGroup;
  socialForm: FormGroup;
  seoForm: FormGroup;

  // الإعدادات الحالية
  settings: StoreSettings = {
    general: {
      storeName: 'متجر إلكتروني',
      storeEmail: 'info@example.com',
      storePhone: '+966 12 345 6789',
      storeAddress: 'الرياض، المملكة العربية السعودية',
      storeLogo: 'assets/img/logo.png',
      storeFavicon: 'assets/img/favicon.png',
      storeDescription: 'متجر إلكتروني لبيع المنتجات المختلفة',
      storeKeywords: 'متجر، إلكتروني، منتجات',
      storeCurrency: 'SAR',
      storeLanguage: 'ar',
      storeTimeZone: 'Asia/Riyadh'
    },
    shipping: {
      enableShipping: true,
      shippingMethods: [
        { id: 1, name: 'الشحن العادي', cost: 30, isDefault: true, isActive: true },
        { id: 2, name: 'الشحن السريع', cost: 50, isDefault: false, isActive: true }
      ],
      freeShippingThreshold: 500
    },
    payment: {
      enableCashOnDelivery: true,
      enableCreditCard: true,
      enablePayPal: false,
      enableBankTransfer: true,
      paymentInstructions: 'يرجى تحويل المبلغ إلى الحساب البنكي التالي: IBAN SA123456789'
    },
    tax: {
      enableTax: true,
      taxRate: 15,
      includeTaxInPrice: true
    },
    email: {
      smtpServer: 'smtp.example.com',
      smtpPort: 587,
      smtpUsername: 'info@example.com',
      smtpPassword: '********',
      smtpEncryption: 'tls',
      senderName: 'متجر إلكتروني',
      senderEmail: 'info@example.com'
    },
    social: {
      facebook: 'https://facebook.com/store',
      twitter: 'https://twitter.com/store',
      instagram: 'https://instagram.com/store',
      youtube: 'https://youtube.com/store',
      linkedin: 'https://linkedin.com/company/store'
    },
    seo: {
      metaTitle: 'متجر إلكتروني | الصفحة الرئيسية',
      metaDescription: 'متجر إلكتروني لبيع المنتجات المختلفة بأسعار مناسبة وجودة عالية',
      metaKeywords: 'متجر، إلكتروني، منتجات، أسعار، جودة',
      googleAnalyticsId: 'UA-123456789-1'
    }
  };

  // التبويب النشط
  activeTab = 'general';

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    // إنشاء النماذج
    this.generalForm = this.fb.group({
      storeName: ['', [Validators.required]],
      storeEmail: ['', [Validators.required, Validators.email]],
      storePhone: ['', [Validators.required]],
      storeAddress: ['', [Validators.required]],
      storeLogo: ['', [Validators.required]],
      storeFavicon: ['', [Validators.required]],
      storeDescription: ['', [Validators.required]],
      storeKeywords: [''],
      storeCurrency: ['SAR', [Validators.required]],
      storeLanguage: ['ar', [Validators.required]],
      storeTimeZone: ['Asia/Riyadh', [Validators.required]]
    });

    this.shippingForm = this.fb.group({
      enableShipping: [true],
      freeShippingThreshold: [0, [Validators.min(0)]]
    });

    this.paymentForm = this.fb.group({
      enableCashOnDelivery: [true],
      enableCreditCard: [true],
      enablePayPal: [false],
      enableBankTransfer: [true],
      paymentInstructions: ['']
    });

    this.taxForm = this.fb.group({
      enableTax: [true],
      taxRate: [15, [Validators.required, Validators.min(0), Validators.max(100)]],
      includeTaxInPrice: [true]
    });

    this.emailForm = this.fb.group({
      smtpServer: ['', [Validators.required]],
      smtpPort: [587, [Validators.required, Validators.min(1), Validators.max(65535)]],
      smtpUsername: ['', [Validators.required]],
      smtpPassword: ['', [Validators.required]],
      smtpEncryption: ['tls', [Validators.required]],
      senderName: ['', [Validators.required]],
      senderEmail: ['', [Validators.required, Validators.email]]
    });

    this.socialForm = this.fb.group({
      facebook: [''],
      twitter: [''],
      instagram: [''],
      youtube: [''],
      linkedin: ['']
    });

    this.seoForm = this.fb.group({
      metaTitle: ['', [Validators.required]],
      metaDescription: ['', [Validators.required]],
      metaKeywords: [''],
      googleAnalyticsId: ['']
    });
  }

  ngOnInit(): void {
    // تعبئة النماذج بالإعدادات الحالية
    this.loadSettings();
  }

  /**
   * تحميل الإعدادات الحالية
   */
  loadSettings(): void {
    // تعبئة نموذج الإعدادات العامة
    this.generalForm.patchValue(this.settings.general);

    // تعبئة نموذج إعدادات الشحن
    this.shippingForm.patchValue({
      enableShipping: this.settings.shipping.enableShipping,
      freeShippingThreshold: this.settings.shipping.freeShippingThreshold
    });

    // تعبئة نموذج إعدادات الدفع
    this.paymentForm.patchValue(this.settings.payment);

    // تعبئة نموذج إعدادات الضريبة
    this.taxForm.patchValue(this.settings.tax);

    // تعبئة نموذج إعدادات البريد الإلكتروني
    this.emailForm.patchValue(this.settings.email);

    // تعبئة نموذج إعدادات وسائل التواصل الاجتماعي
    this.socialForm.patchValue(this.settings.social);

    // تعبئة نموذج إعدادات تحسين محركات البحث
    this.seoForm.patchValue(this.settings.seo);
  }

  /**
   * تغيير التبويب النشط
   */
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  /**
   * حفظ الإعدادات العامة
   */
  saveGeneralSettings(): void {
    if (this.generalForm.invalid) {
      // تحديد جميع الحقول كـ "تم لمسها" لإظهار رسائل الخطأ
      Object.keys(this.generalForm.controls).forEach(key => {
        const control = this.generalForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    // تحديث الإعدادات
    this.settings.general = this.generalForm.value;

    // عرض رسالة نجاح
    this.toastr.success('تم حفظ الإعدادات العامة بنجاح');
  }

  /**
   * حفظ إعدادات الشحن
   */
  saveShippingSettings(): void {
    if (this.shippingForm.invalid) {
      Object.keys(this.shippingForm.controls).forEach(key => {
        const control = this.shippingForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    // تحديث الإعدادات
    this.settings.shipping.enableShipping = this.shippingForm.value.enableShipping;
    this.settings.shipping.freeShippingThreshold = this.shippingForm.value.freeShippingThreshold;

    // عرض رسالة نجاح
    this.toastr.success('تم حفظ إعدادات الشحن بنجاح');
  }

  /**
   * حفظ إعدادات الدفع
   */
  savePaymentSettings(): void {
    if (this.paymentForm.invalid) {
      Object.keys(this.paymentForm.controls).forEach(key => {
        const control = this.paymentForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    // تحديث الإعدادات
    this.settings.payment = this.paymentForm.value;

    // عرض رسالة نجاح
    this.toastr.success('تم حفظ إعدادات الدفع بنجاح');
  }

  /**
   * حفظ إعدادات الضريبة
   */
  saveTaxSettings(): void {
    if (this.taxForm.invalid) {
      Object.keys(this.taxForm.controls).forEach(key => {
        const control = this.taxForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    // تحديث الإعدادات
    this.settings.tax = this.taxForm.value;

    // عرض رسالة نجاح
    this.toastr.success('تم حفظ إعدادات الضريبة بنجاح');
  }

  /**
   * حفظ إعدادات البريد الإلكتروني
   */
  saveEmailSettings(): void {
    if (this.emailForm.invalid) {
      Object.keys(this.emailForm.controls).forEach(key => {
        const control = this.emailForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    // تحديث الإعدادات
    this.settings.email = this.emailForm.value;

    // عرض رسالة نجاح
    this.toastr.success('تم حفظ إعدادات البريد الإلكتروني بنجاح');
  }

  /**
   * حفظ إعدادات وسائل التواصل الاجتماعي
   */
  saveSocialSettings(): void {
    if (this.socialForm.invalid) {
      Object.keys(this.socialForm.controls).forEach(key => {
        const control = this.socialForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    // تحديث الإعدادات
    this.settings.social = this.socialForm.value;

    // عرض رسالة نجاح
    this.toastr.success('تم حفظ إعدادات وسائل التواصل الاجتماعي بنجاح');
  }

  /**
   * حفظ إعدادات تحسين محركات البحث
   */
  saveSeoSettings(): void {
    if (this.seoForm.invalid) {
      Object.keys(this.seoForm.controls).forEach(key => {
        const control = this.seoForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    // تحديث الإعدادات
    this.settings.seo = this.seoForm.value;

    // عرض رسالة نجاح
    this.toastr.success('تم حفظ إعدادات تحسين محركات البحث بنجاح');
  }

  /**
   * إضافة طريقة شحن جديدة
   */
  addShippingMethod(): void {
    const newMethod = {
      id: this.settings.shipping.shippingMethods.length + 1,
      name: 'طريقة شحن جديدة',
      cost: 0,
      isDefault: false,
      isActive: true
    };

    this.settings.shipping.shippingMethods.push(newMethod);
    this.toastr.success('تم إضافة طريقة شحن جديدة');
  }

  /**
   * حذف طريقة شحن
   */
  deleteShippingMethod(id: number): void {
    this.settings.shipping.shippingMethods = this.settings.shipping.shippingMethods.filter(method => method.id !== id);
    this.toastr.success('تم حذف طريقة الشحن بنجاح');
  }

  /**
   * تعيين طريقة شحن كافتراضية
   */
  setDefaultShippingMethod(id: number): void {
    this.settings.shipping.shippingMethods.forEach(method => {
      method.isDefault = method.id === id;
    });
    this.toastr.success('تم تعيين طريقة الشحن الافتراضية بنجاح');
  }

  /**
   * تغيير حالة طريقة الشحن (نشطة/غير نشطة)
   */
  toggleShippingMethodStatus(id: number): void {
    const method = this.settings.shipping.shippingMethods.find(m => m.id === id);
    if (method) {
      method.isActive = !method.isActive;
      this.toastr.success(`تم ${method.isActive ? 'تفعيل' : 'تعطيل'} طريقة الشحن بنجاح`);
    }
  }

  /**
   * إرسال بريد إلكتروني تجريبي
   */
  sendTestEmail(): void {
    if (this.emailForm.invalid) {
      Object.keys(this.emailForm.controls).forEach(key => {
        const control = this.emailForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    // محاكاة إرسال بريد إلكتروني تجريبي
    setTimeout(() => {
      this.toastr.success('تم إرسال البريد الإلكتروني التجريبي بنجاح');
    }, 1000);
  }
}
