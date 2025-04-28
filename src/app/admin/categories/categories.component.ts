import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Category } from '../../shared/interfaces/category.interface';
import { Product } from '../../shared/interfaces/product.interface';
import { CategoryService } from '../../shared/services/category.service';
import { ProductService } from '../../shared/services/product.service';
import { ToastrService } from '../../shared/services/toastr.service';
import { IconPickerComponent } from '../../shared/components/icon-picker/icon-picker.component';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, IconPickerComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  // بيانات الفئات
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  selectedCategory: Category | null = null;

  // بيانات المنتجات في الفئة المحددة
  categoryProducts: Product[] = [];

  // نموذج الفئة
  categoryForm: FormGroup;
  isEditMode = false;

  // فلترة وترتيب
  searchTerm = '';
  sortBy = 'displayOrder';
  sortOrder = 'asc';
  showParentOnly = true;
  showActiveOnly = true;

  // ترقيم الصفحات
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // قائمة الفئات الرئيسية (للاختيار منها عند إنشاء فئة فرعية)
  parentCategories: Category[] = [];

  // النوافذ المنبثقة
  categoryModal: any;
  deleteModal: any;
  detailsModal: any;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private toastr: ToastrService
  ) {
    // إنشاء نموذج الفئة
    this.categoryForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      icon: ['', [Validators.required]],
      slug: [''],
      displayOrder: [0],
      isParent: [true],
      parentId: [null],
      active: [true],
      productCount: [0]
    });
  }

  ngOnInit(): void {
    // تحميل البيانات
    this.loadCategories();
    this.loadParentCategories();

    // تهيئة النوافذ المنبثقة
    this.initModals();
  }

  /**
   * تحميل الفئات
   */
  loadCategories(): void {
    this.categoryService.getCategories(this.showParentOnly, this.showActiveOnly, this.sortBy, this.sortOrder).subscribe({
      next: (categories) => {
        this.categories = categories;
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.toastr.error('حدث خطأ أثناء تحميل الفئات');
      }
    });
  }

  /**
   * تحميل الفئات الرئيسية (للاختيار منها عند إنشاء فئة فرعية)
   */
  loadParentCategories(): void {
    this.categoryService.getParentCategories().subscribe({
      next: (categories) => {
        this.parentCategories = categories;
      },
      error: (error) => {
        console.error('Error loading parent categories:', error);
        this.toastr.error('حدث خطأ أثناء تحميل الفئات الرئيسية');
      }
    });
  }

  /**
   * تهيئة النوافذ المنبثقة
   */
  initModals(): void {
    setTimeout(() => {
      this.categoryModal = new bootstrap.Modal(document.getElementById('categoryModal'));
      this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
      this.detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    }, 500);
  }

  /**
   * تطبيق الفلترة والترتيب
   */
  applyFilter(): void {
    // تطبيق الفلترة
    this.filteredCategories = this.categories.filter(category => {
      const matchesSearch = !this.searchTerm ||
        category.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (category.slug && category.slug.toLowerCase().includes(this.searchTerm.toLowerCase()));

      return matchesSearch;
    });

    // تطبيق الترتيب
    this.sortCategories();

    // حساب عدد الصفحات
    this.calculatePagination();
  }

  /**
   * ترتيب الفئات
   */
  sortCategories(): void {
    switch (this.sortBy) {
      case 'name':
        this.filteredCategories.sort((a, b) => {
          return this.sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        });
        break;
      case 'productCount':
        this.filteredCategories.sort((a, b) => {
          return this.sortOrder === 'asc'
            ? (a.productCount || 0) - (b.productCount || 0)
            : (b.productCount || 0) - (a.productCount || 0);
        });
        break;
      case 'displayOrder':
        this.filteredCategories.sort((a, b) => {
          return this.sortOrder === 'asc'
            ? (a.displayOrder || 0) - (b.displayOrder || 0)
            : (b.displayOrder || 0) - (a.displayOrder || 0);
        });
        break;
      default:
        this.filteredCategories.sort((a, b) => {
          return this.sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
        });
        break;
    }
  }

  /**
   * تغيير ترتيب الفئات
   */
  changeSorting(sortBy: string): void {
    if (this.sortBy === sortBy) {
      // إذا كان نفس حقل الترتيب، نقوم بتبديل اتجاه الترتيب
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // إذا كان حقل ترتيب مختلف، نقوم بتعيين الحقل الجديد واتجاه الترتيب الافتراضي (تصاعدي)
      this.sortBy = sortBy;
      this.sortOrder = 'asc';
    }

    // إعادة تطبيق الفلتر مع الترتيب الجديد
    this.applyFilter();
  }

  /**
   * تغيير فلتر عرض الفئات
   */
  changeFilter(): void {
    this.loadCategories();
  }

  /**
   * حساب ترقيم الصفحات
   */
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCategories.length / this.pageSize);

    // تعديل الصفحة الحالية إذا كانت خارج النطاق
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }

    // تطبيق ترقيم الصفحات
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredCategories = this.filteredCategories.slice(startIndex, startIndex + this.pageSize);
  }

  /**
   * الحصول على أرقام الصفحات للعرض
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  /**
   * تغيير الصفحة الحالية
   */
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilter();
    }
  }

  /**
   * فتح نافذة إضافة فئة جديدة
   */
  openAddCategoryModal(): void {
    this.isEditMode = false;
    this.categoryForm.reset({
      displayOrder: 0,
      isParent: true,
      parentId: null,
      active: true,
      productCount: 0
    });

    // توليد رقم عشوائي للترتيب
    const randomOrder = Math.floor(Math.random() * 100) + 1;
    this.categoryForm.get('displayOrder')?.setValue(randomOrder);

    this.categoryModal.show();
  }

  /**
   * فتح نافذة تعديل فئة
   */
  editCategory(category: Category): void {
    this.isEditMode = true;
    this.selectedCategory = category;

    this.categoryForm.patchValue({
      id: category.id,
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
      icon: category.icon || '',
      slug: category.slug || '',
      displayOrder: category.displayOrder || 0,
      isParent: category.isParent,
      parentId: category.parentId || null,
      active: category.active,
      productCount: category.productCount || 0
    });

    this.categoryModal.show();
  }

  /**
   * حفظ الفئة (إضافة أو تعديل)
   */
  saveCategory(): void {
    if (this.categoryForm.invalid) {
      // تحديد جميع الحقول كـ "تم لمسها" لإظهار رسائل الخطأ
      Object.keys(this.categoryForm.controls).forEach(key => {
        const control = this.categoryForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const categoryData = this.categoryForm.value;

    // التحقق من الأيقونة
    if (!categoryData.icon) {
      categoryData.icon = 'bi bi-tag';
    }

    // إنشاء slug من الاسم إذا لم يتم إدخاله
    if (!categoryData.slug) {
      categoryData.slug = this.generateSlug(categoryData.name);
    }

    // التحقق من parentId
    if (!categoryData.isParent && !categoryData.parentId) {
      this.toastr.error('يجب اختيار تصنيف رئيسي للتصنيف الفرعي');
      return;
    }

    // إذا كان تصنيف رئيسي، نجعل parentId = null
    if (categoryData.isParent) {
      categoryData.parentId = null;
    }

    if (this.isEditMode) {
      // تعديل فئة موجودة
      this.categoryService.updateCategory(categoryData).subscribe({
        next: () => {
          this.toastr.success('تم تعديل التصنيف بنجاح');
          this.loadCategories();
          this.loadParentCategories();
          this.categoryModal.hide();
        },
        error: (error) => {
          console.error('Error updating category:', error);
          if (error.error && typeof error.error === 'string') {
            this.toastr.error(error.error);
          } else {
            this.toastr.error('حدث خطأ أثناء تعديل التصنيف');
          }
        }
      });
    } else {
      // إضافة فئة جديدة
      this.categoryService.addCategory(categoryData).subscribe({
        next: () => {
          this.toastr.success('تم إضافة التصنيف بنجاح');
          this.loadCategories();
          this.loadParentCategories();
          this.categoryModal.hide();
        },
        error: (error) => {
          console.error('Error adding category:', error);
          if (error.error && typeof error.error === 'string') {
            this.toastr.error(error.error);
          } else {
            this.toastr.error('حدث خطأ أثناء إضافة التصنيف');
          }
        }
      });
    }
  }

  /**
   * إنشاء slug من النص
   */
  private generateSlug(text: string): string {
    // تحويل النص إلى أحرف صغيرة
    let slug = text.toLowerCase();

    // استبدال الأحرف العربية بأحرف إنجليزية (تبسيط)
    const arabicToEnglish: { [key: string]: string } = {
      'أ': 'a', 'إ': 'a', 'آ': 'a', 'ا': 'a',
      'ب': 'b', 'ت': 't', 'ث': 'th',
      'ج': 'j', 'ح': 'h', 'خ': 'kh',
      'د': 'd', 'ذ': 'th',
      'ر': 'r', 'ز': 'z',
      'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd',
      'ط': 't', 'ظ': 'z',
      'ع': 'a', 'غ': 'gh',
      'ف': 'f', 'ق': 'q', 'ك': 'k',
      'ل': 'l', 'م': 'm', 'ن': 'n',
      'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a', 'ئ': 'e'
    };

    // استبدال الأحرف العربية
    for (const arabic in arabicToEnglish) {
      const english = arabicToEnglish[arabic];
      slug = slug.replace(new RegExp(arabic, 'g'), english);
    }

    // استبدال المسافات والأحرف الخاصة بشرطات
    slug = slug.replace(/[^a-z0-9]/g, '-');

    // إزالة الشرطات المتكررة
    slug = slug.replace(/-+/g, '-');

    // إزالة الشرطات من البداية والنهاية
    slug = slug.replace(/^-+|-+$/g, '');

    return slug;
  }

  /**
   * فتح نافذة حذف فئة
   */
  deleteCategory(category: Category): void {
    this.selectedCategory = category;
    this.deleteModal.show();
  }

  /**
   * تأكيد حذف الفئة
   */
  confirmDelete(): void {
    if (!this.selectedCategory) return;

    this.categoryService.deleteCategory(this.selectedCategory.id).subscribe({
      next: () => {
        this.toastr.success('تم حذف التصنيف بنجاح');
        this.loadCategories();
        this.loadParentCategories();
        this.deleteModal.hide();
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        if (error.error && typeof error.error === 'object' && error.error.message) {
          this.toastr.error(error.error.message);
        } else if (error.error && typeof error.error === 'string') {
          this.toastr.error(error.error);
        } else {
          this.toastr.error('حدث خطأ أثناء حذف التصنيف');
        }
        this.deleteModal.hide();
      }
    });
  }

  /**
   * عرض تفاصيل الفئة
   */
  viewCategoryDetails(category: Category): void {
    this.selectedCategory = category;

    // تحميل المنتجات في هذه الفئة
    this.loadCategoryProducts(category.id);

    this.detailsModal.show();
  }

  /**
   * تحميل المنتجات في فئة محددة
   */
  loadCategoryProducts(categoryId: number): void {
    this.productService.getProductsByCategory(categoryId.toString()).subscribe(
      (products) => {
        this.categoryProducts = products.slice(0, 6); // عرض أول 6 منتجات فقط
      },
      (error) => {
        console.error('Error loading category products:', error);
        this.categoryProducts = [];
      }
    );
  }

  /**
   * الحصول على اسم التصنيف الرئيسي من معرفه
   */
  getParentCategoryName(parentId: number | null | undefined): string {
    if (!parentId) return 'غير محدد';

    const parentCategory = this.parentCategories.find(c => c.id === parentId);
    return parentCategory ? parentCategory.name : 'غير محدد';
  }
}
