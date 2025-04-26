import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MarketingService } from '../../../shared/services/marketing.service';
import { ToastrService } from '../../../shared/services/toastr.service';
import { Promotion, PromotionProduct, PromotionCategory } from '../../../shared/interfaces/promotion.interface';

declare var bootstrap: any;

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {
  // بيانات العروض الترويجية
  promotions: Promotion[] = [];
  filteredPromotions: Promotion[] = [];
  selectedPromotion: Promotion | null = null;

  // بيانات المنتجات والتصنيفات
  products: PromotionProduct[] = [];
  categories: PromotionCategory[] = [];

  // نموذج العرض الترويجي
  promotionForm: FormGroup;

  // حالة التحميل
  isLoading = false;

  // حالة النموذج
  isEditMode = false;

  // مرجع النافذة المنبثقة
  private promotionModal: any;

  // فلترة وترتيب
  searchTerm = '';
  statusFilter = 'all'; // all, active, inactive

  // ترقيم الصفحات
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(
    private fb: FormBuilder,
    private marketingService: MarketingService,
    private toastr: ToastrService
  ) {
    // إنشاء نموذج العرض الترويجي
    this.promotionForm = this.fb.group({
      id: [null],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      discountType: ['percentage', [Validators.required]],
      discountValue: [0, [Validators.required, Validators.min(1)]],
      buyQuantity: [null],
      getQuantity: [null],
      minOrderValue: [0, [Validators.min(0)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      productIds: [[]],
      categoryIds: [[]],
      active: [true],
      featured: [false],
      bannerImage: ['']
    }, {
      validators: this.dateRangeValidator
    });
  }

  ngOnInit(): void {
    this.loadPromotions();
    this.loadCategories();
    this.loadProducts();
  }

  /**
   * تهيئة النافذة المنبثقة بعد تحميل العرض
   */
  ngAfterViewInit(): void {
    // تهيئة النافذة المنبثقة
    const modalElement = document.getElementById('promotionFormModal');
    if (modalElement) {
      this.promotionModal = new bootstrap.Modal(modalElement);
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
   * تحميل العروض الترويجية
   */
  loadPromotions(): void {
    this.isLoading = true;
    this.marketingService.getPromotions().subscribe({
      next: (promotions) => {
        this.promotions = promotions;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading promotions:', error);
        this.toastr.error('حدث خطأ أثناء تحميل العروض الترويجية');
        this.isLoading = false;
      }
    });
  }

  /**
   * تحميل التصنيفات
   */
  loadCategories(): void {
    this.marketingService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  /**
   * تحميل المنتجات
   */
  loadProducts(): void {
    this.marketingService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  /**
   * تطبيق الفلترة
   */
  applyFilter(): void {
    let filtered = [...this.promotions];

    // فلترة حسب البحث
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(promotion =>
        promotion.title.toLowerCase().includes(term) ||
        promotion.description.toLowerCase().includes(term)
      );
    }

    // فلترة حسب الحالة
    const now = new Date();
    switch (this.statusFilter) {
      case 'active':
        filtered = filtered.filter(promotion =>
          promotion.active && new Date(promotion.endDate) >= now
        );
        break;
      case 'inactive':
        filtered = filtered.filter(promotion =>
          !promotion.active || new Date(promotion.endDate) < now
        );
        break;
    }

    // تطبيق ترقيم الصفحات
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredPromotions = filtered.slice(startIndex, startIndex + this.pageSize);
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
   * فتح نموذج إضافة عرض ترويجي جديد
   */
  openAddPromotionForm(): void {
    this.isEditMode = false;
    this.selectedPromotion = null;
    this.resetForm();
    // فتح النافذة المنبثقة
    if (this.promotionModal) {
      this.promotionModal.show();
    }
  }

  /**
   * فتح نموذج تعديل عرض ترويجي
   */
  openEditPromotionForm(promotion: Promotion): void {
    this.isEditMode = true;
    this.selectedPromotion = promotion;

    // تعبئة النموذج ببيانات العرض الترويجي
    this.promotionForm.patchValue({
      id: promotion.id,
      title: promotion.title,
      description: promotion.description,
      discountType: promotion.discountType,
      discountValue: promotion.discountValue,
      buyQuantity: promotion.buyQuantity,
      getQuantity: promotion.getQuantity,
      minOrderValue: promotion.minOrderValue,
      startDate: this.formatDateForInput(promotion.startDate),
      endDate: this.formatDateForInput(promotion.endDate),
      productIds: promotion.productIds || [],
      categoryIds: promotion.categoryIds || [],
      active: promotion.active,
      featured: promotion.featured,
      bannerImage: promotion.bannerImage || ''
    });

    // فتح النافذة المنبثقة
    if (this.promotionModal) {
      this.promotionModal.show();
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
   * حفظ العرض الترويجي
   */
  savePromotion(): void {
    if (this.promotionForm.invalid) {
      // تحديد جميع الحقول كـ "تم لمسها" لإظهار رسائل الخطأ
      Object.keys(this.promotionForm.controls).forEach(key => {
        const control = this.promotionForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const promotionData = this.promotionForm.value;

    // التحقق من نوع الخصم
    if (promotionData.discountType === 'buy_x_get_y' && (!promotionData.buyQuantity || !promotionData.getQuantity)) {
      this.toastr.error('يرجى تحديد كمية الشراء وكمية الحصول عليها');
      this.isLoading = false;
      return;
    }

    if (this.isEditMode) {
      // تحديث عرض ترويجي موجود
      this.marketingService.updatePromotion(promotionData).subscribe({
        next: () => {
          this.toastr.success('تم تحديث العرض الترويجي بنجاح');
          this.loadPromotions();
          this.resetForm();
          // إغلاق النافذة المنبثقة
          if (this.promotionModal) {
            this.promotionModal.hide();
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating promotion:', error);
          this.toastr.error('حدث خطأ أثناء تحديث العرض الترويجي');
          this.isLoading = false;
        }
      });
    } else {
      // إضافة عرض ترويجي جديد
      this.marketingService.addPromotion(promotionData).subscribe({
        next: () => {
          this.toastr.success('تم إضافة العرض الترويجي بنجاح');
          this.loadPromotions();
          this.resetForm();
          // إغلاق النافذة المنبثقة
          if (this.promotionModal) {
            this.promotionModal.hide();
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error adding promotion:', error);
          this.toastr.error('حدث خطأ أثناء إضافة العرض الترويجي');
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * حذف عرض ترويجي
   */
  deletePromotion(promotion: Promotion): void {
    if (confirm(`هل أنت متأكد من حذف العرض الترويجي "${promotion.title}"؟`)) {
      this.isLoading = true;
      this.marketingService.deletePromotion(promotion.id).subscribe({
        next: () => {
          this.toastr.success('تم حذف العرض الترويجي بنجاح');
          this.loadPromotions();
        },
        error: (error) => {
          console.error('Error deleting promotion:', error);
          this.toastr.error('حدث خطأ أثناء حذف العرض الترويجي');
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * تغيير حالة العرض الترويجي
   */
  togglePromotionStatus(promotion: Promotion): void {
    this.isLoading = true;
    this.marketingService.togglePromotionStatus(promotion.id, !promotion.active).subscribe({
      next: () => {
        this.toastr.success(`تم ${!promotion.active ? 'تفعيل' : 'تعطيل'} العرض الترويجي بنجاح`);
        this.loadPromotions();
      },
      error: (error) => {
        console.error('Error updating promotion status:', error);
        this.toastr.error('حدث خطأ أثناء تحديث حالة العرض الترويجي');
        this.isLoading = false;
      }
    });
  }

  /**
   * تغيير حالة العرض المميز
   */
  togglePromotionFeatured(promotion: Promotion): void {
    this.isLoading = true;
    this.marketingService.togglePromotionFeatured(promotion.id, !promotion.featured).subscribe({
      next: () => {
        this.toastr.success(`تم ${!promotion.featured ? 'تمييز' : 'إلغاء تمييز'} العرض الترويجي بنجاح`);
        this.loadPromotions();
      },
      error: (error) => {
        console.error('Error updating promotion featured status:', error);
        this.toastr.error('حدث خطأ أثناء تحديث حالة التمييز');
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

    this.promotionForm.reset({
      discountType: 'percentage',
      discountValue: 0,
      minOrderValue: 0,
      startDate: today,
      endDate: nextMonth.toISOString().split('T')[0],
      productIds: [],
      categoryIds: [],
      active: true,
      featured: false
    });
  }

  /**
   * التحقق من حالة العرض الترويجي
   */
  isPromotionActive(promotion: Promotion): boolean {
    const now = new Date();
    const endDate = new Date(promotion.endDate);
    return promotion.active && endDate >= now;
  }

  /**
   * الحصول على نص نوع الخصم
   */
  getDiscountTypeText(type: string): string {
    switch (type) {
      case 'percentage': return 'نسبة مئوية';
      case 'fixed': return 'مبلغ ثابت';
      case 'buy_x_get_y': return 'اشتر X واحصل على Y';
      default: return type;
    }
  }

  /**
   * الحصول على قيمة الخصم المنسقة
   */
  getFormattedDiscountValue(promotion: Promotion): string {
    if (promotion.discountType === 'percentage') {
      return `${promotion.discountValue}%`;
    } else if (promotion.discountType === 'fixed') {
      return `${promotion.discountValue} ريال`;
    } else if (promotion.discountType === 'buy_x_get_y') {
      return `اشتر ${promotion.buyQuantity} واحصل على ${promotion.getQuantity}`;
    }
    return '';
  }

  /**
   * الحصول على أسماء التصنيفات المحددة
   */
  getCategoryNames(categoryIds: number[] | undefined): string {
    if (!categoryIds || categoryIds.length === 0) {
      return 'جميع التصنيفات';
    }

    const categoryNames = categoryIds.map(id => {
      const category = this.categories.find(c => c.id === id);
      return category ? category.name : '';
    }).filter(name => name);

    return categoryNames.join('، ');
  }

  /**
   * تبديل تحديد التصنيف
   */
  toggleCategorySelection(categoryId: number, event: any): void {
    const isChecked = event.target.checked;
    const categoryIds = this.promotionForm.get('categoryIds')?.value || [];

    if (isChecked) {
      // إضافة التصنيف إلى القائمة
      this.promotionForm.get('categoryIds')?.setValue([...categoryIds, categoryId]);
    } else {
      // إزالة التصنيف من القائمة
      this.promotionForm.get('categoryIds')?.setValue(categoryIds.filter((id: number) => id !== categoryId));
    }
  }
}
