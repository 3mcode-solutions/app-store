import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MarketingService } from '../../../shared/services/marketing.service';
import { ToastrService } from '../../../shared/services/toastr.service';
import { Coupon } from '../../../shared/interfaces/coupon.interface';

declare var bootstrap: any;

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit, AfterViewInit {
  // بيانات الكوبونات
  coupons: Coupon[] = [];
  filteredCoupons: Coupon[] = [];
  selectedCoupon: Coupon | null = null;

  // نموذج الكوبون
  couponForm: FormGroup;

  // حالة التحميل
  isLoading = false;

  // حالة النموذج
  isEditMode = false;

  // مرجع النافذة المنبثقة
  private couponModal: any;

  // فلترة وترتيب
  searchTerm = '';
  statusFilter = 'all'; // all, active, expired

  // ترقيم الصفحات
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private fb: FormBuilder,
    private marketingService: MarketingService,
    private toastr: ToastrService
  ) {
    // إنشاء نموذج الكوبون
    this.couponForm = this.fb.group({
      id: [null],
      code: ['', [Validators.required, Validators.minLength(3)]],
      discountType: ['percentage', [Validators.required]],
      discountValue: [0, [Validators.required, Validators.min(1)]],
      minOrderValue: [0, [Validators.min(0)]],
      maxUses: [0, [Validators.min(0)]],
      usedCount: [0],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      active: [true]
    }, {
      validators: this.dateRangeValidator
    });
  }

  ngOnInit(): void {
    this.loadCoupons();
  }

  /**
   * تهيئة النافذة المنبثقة بعد تحميل العرض
   */
  ngAfterViewInit(): void {
    // تهيئة النافذة المنبثقة
    const modalElement = document.getElementById('couponFormModal');
    if (modalElement) {
      this.couponModal = new bootstrap.Modal(modalElement);
    }
  }

  /**
   * التحقق من صحة نطاق التاريخ
   */
  dateRangeValidator(form: FormGroup) {
    const startDate = form.get('startDate')?.value;
    const endDate = form.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        form.get('endDate')?.setErrors({ dateRange: true });
        return { dateRange: true };
      }
    }

    return null;
  }

  /**
   * تحميل الكوبونات
   */
  loadCoupons(): void {
    this.isLoading = true;
    this.marketingService.getCoupons().subscribe({
      next: (coupons) => {
        this.coupons = coupons;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading coupons:', error);
        this.toastr.error('حدث خطأ أثناء تحميل الكوبونات');
        this.isLoading = false;
      }
    });
  }

  /**
   * تطبيق الفلترة
   */
  applyFilter(): void {
    let filtered = [...this.coupons];

    // فلترة حسب البحث
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(coupon =>
        coupon.code.toLowerCase().includes(term)
      );
    }

    // فلترة حسب الحالة
    const now = new Date();
    switch (this.statusFilter) {
      case 'active':
        filtered = filtered.filter(coupon =>
          coupon.active && new Date(coupon.endDate) >= now
        );
        break;
      case 'expired':
        filtered = filtered.filter(coupon =>
          !coupon.active || new Date(coupon.endDate) < now
        );
        break;
    }

    // تطبيق ترقيم الصفحات
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredCoupons = filtered.slice(startIndex, startIndex + this.pageSize);
  }

  /**
   * تغيير الصفحة
   */
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilter();
    }
  }

  /**
   * فتح نموذج إضافة كوبون جديد
   */
  openAddCouponForm(): void {
    this.isEditMode = false;
    this.selectedCoupon = null;
    this.resetForm();
    // فتح النافذة المنبثقة
    if (this.couponModal) {
      this.couponModal.show();
    }
  }

  /**
   * فتح نموذج تعديل كوبون
   */
  openEditCouponForm(coupon: Coupon): void {
    this.isEditMode = true;
    this.selectedCoupon = coupon;

    // تعبئة النموذج ببيانات الكوبون
    this.couponForm.patchValue({
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      maxUses: coupon.maxUses,
      usedCount: coupon.usedCount,
      startDate: this.formatDateForInput(coupon.startDate),
      endDate: this.formatDateForInput(coupon.endDate),
      active: coupon.active
    });

    // فتح النافذة المنبثقة
    if (this.couponModal) {
      this.couponModal.show();
    }
  }

  /**
   * تنسيق التاريخ لحقل الإدخال
   */
  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  /**
   * حفظ الكوبون
   */
  saveCoupon(): void {
    if (this.couponForm.invalid) {
      // تحديد جميع الحقول كـ "تم لمسها" لإظهار رسائل الخطأ
      Object.keys(this.couponForm.controls).forEach(key => {
        const control = this.couponForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const couponData = this.couponForm.value;

    if (this.isEditMode) {
      // تحديث كوبون موجود
      this.marketingService.updateCoupon(couponData).subscribe({
        next: () => {
          this.toastr.success('تم تحديث الكوبون بنجاح');
          this.loadCoupons();
          this.resetForm();
          // إغلاق النافذة المنبثقة
          if (this.couponModal) {
            this.couponModal.hide();
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating coupon:', error);
          this.toastr.error('حدث خطأ أثناء تحديث الكوبون');
          this.isLoading = false;
        }
      });
    } else {
      // إضافة كوبون جديد
      this.marketingService.addCoupon(couponData).subscribe({
        next: () => {
          this.toastr.success('تم إضافة الكوبون بنجاح');
          this.loadCoupons();
          this.resetForm();
          // إغلاق النافذة المنبثقة
          if (this.couponModal) {
            this.couponModal.hide();
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error adding coupon:', error);
          this.toastr.error('حدث خطأ أثناء إضافة الكوبون');
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * حذف كوبون
   */
  deleteCoupon(coupon: Coupon): void {
    if (confirm(`هل أنت متأكد من حذف الكوبون "${coupon.code}"؟`)) {
      this.isLoading = true;
      this.marketingService.deleteCoupon(coupon.id).subscribe({
        next: () => {
          this.toastr.success('تم حذف الكوبون بنجاح');
          this.loadCoupons();
        },
        error: (error) => {
          console.error('Error deleting coupon:', error);
          this.toastr.error('حدث خطأ أثناء حذف الكوبون');
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * تغيير حالة الكوبون
   */
  toggleCouponStatus(coupon: Coupon): void {
    const updatedCoupon = { ...coupon, active: !coupon.active };

    this.isLoading = true;
    this.marketingService.updateCoupon(updatedCoupon).subscribe({
      next: () => {
        this.toastr.success(`تم ${updatedCoupon.active ? 'تفعيل' : 'تعطيل'} الكوبون بنجاح`);
        this.loadCoupons();
      },
      error: (error) => {
        console.error('Error updating coupon status:', error);
        this.toastr.error('حدث خطأ أثناء تحديث حالة الكوبون');
        this.isLoading = false;
      }
    });
  }

  /**
   * إعادة تعيين النموذج
   */
  resetForm(): void {
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    this.couponForm.reset({
      discountType: 'percentage',
      discountValue: 0,
      minOrderValue: 0,
      maxUses: 0,
      usedCount: 0,
      startDate: today,
      endDate: nextMonth.toISOString().split('T')[0],
      active: true
    });
  }

  /**
   * التحقق من حالة الكوبون
   */
  isCouponActive(coupon: Coupon): boolean {
    const now = new Date();
    const endDate = new Date(coupon.endDate);
    return coupon.active && endDate >= now;
  }

  /**
   * الحصول على نص نوع الخصم
   */
  getDiscountTypeText(type: string): string {
    switch (type) {
      case 'percentage': return 'نسبة مئوية';
      case 'fixed': return 'مبلغ ثابت';
      default: return type;
    }
  }

  /**
   * الحصول على قيمة الخصم المنسقة
   */
  getFormattedDiscountValue(coupon: Coupon): string {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}%`;
    } else {
      return `${coupon.discountValue} ريال`;
    }
  }
}
