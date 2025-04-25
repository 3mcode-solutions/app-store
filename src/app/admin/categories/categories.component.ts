import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Category } from '../../shared/interfaces/category.interface';
import { Product } from '../../shared/interfaces/product.interface';
import { CategoryService } from '../../shared/services/category.service';
import { ProductService } from '../../shared/services/product.service';
import { ToastrService } from '../../shared/services/toastr.service';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
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
  sortBy = 'id';

  // ترقيم الصفحات
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

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
      icon: [''],
      productCount: [0],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    // تحميل البيانات
    this.loadCategories();

    // تهيئة النوافذ المنبثقة
    this.initModals();
  }

  /**
   * تحميل الفئات
   */
  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories) => {
        this.categories = categories;
        this.applyFilter();
      },
      (error) => {
        console.error('Error loading categories:', error);
        this.toastr.error('حدث خطأ أثناء تحميل الفئات');
      }
    );
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
        (category.description && category.description.toLowerCase().includes(this.searchTerm.toLowerCase()));

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
        this.filteredCategories.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'productCount':
        this.filteredCategories.sort((a, b) => (b.productCount || 0) - (a.productCount || 0));
        break;
      default:
        this.filteredCategories.sort((a, b) => a.id - b.id);
        break;
    }
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
      productCount: 0,
      isActive: true
    });
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
      icon: category.icon ? category.icon.replace('bi bi-', '') : '',
      productCount: category.productCount || 0,
      isActive: category.isActive !== false
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

    // إضافة "bi bi-" للأيقونة إذا تم إدخالها
    if (categoryData.icon) {
      categoryData.icon = `bi bi-${categoryData.icon}`;
    }

    if (this.isEditMode) {
      // تعديل فئة موجودة
      this.categoryService.updateCategory(categoryData).subscribe(
        () => {
          this.toastr.success('تم تعديل الفئة بنجاح');
          this.loadCategories();
          this.categoryModal.hide();
        },
        (error) => {
          console.error('Error updating category:', error);
          this.toastr.error('حدث خطأ أثناء تعديل الفئة');
        }
      );
    } else {
      // إضافة فئة جديدة
      this.categoryService.addCategory(categoryData).subscribe(
        () => {
          this.toastr.success('تم إضافة الفئة بنجاح');
          this.loadCategories();
          this.categoryModal.hide();
        },
        (error) => {
          console.error('Error adding category:', error);
          this.toastr.error('حدث خطأ أثناء إضافة الفئة');
        }
      );
    }
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

    this.categoryService.deleteCategory(this.selectedCategory.id).subscribe(
      () => {
        this.toastr.success('تم حذف الفئة بنجاح');
        this.loadCategories();
        this.deleteModal.hide();
      },
      (error) => {
        console.error('Error deleting category:', error);
        this.toastr.error('حدث خطأ أثناء حذف الفئة');
      }
    );
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
}
