import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { CategoryService } from '../../../shared/services/category.service';
import { ToastrService } from '../../../shared/services/toastr.service';
import { Product } from '../../../shared/interfaces/product.interface';
import { Category } from '../../../shared/interfaces/category.interface';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  // بيانات المنتجات
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProduct: Product | null = null;

  // بيانات الفئات
  categories: Category[] = [];

  // نموذج تحديث المخزون
  inventoryForm: FormGroup;

  // فلترة وترتيب
  searchTerm = '';
  selectedCategory = '';
  stockFilter = 'all'; // all, inStock, outOfStock, lowStock

  // ترقيم الصفحات
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // النوافذ المنبثقة
  updateModal: any;

  // إحصائيات المخزون
  totalProducts = 0;
  inStockProducts = 0;
  outOfStockProducts = 0;
  lowStockProducts = 0; // أقل من 5 قطع

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {
    // إنشاء نموذج تحديث المخزون
    this.inventoryForm = this.fb.group({
      id: [null],
      inStock: [true],
      stockQuantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    // تحميل البيانات
    this.loadProducts();
    this.loadCategories();

    // تهيئة النوافذ المنبثقة
    this.initModals();
  }

  /**
   * تحميل المنتجات
   */
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.calculateInventoryStats();
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.toastr.error('حدث خطأ أثناء تحميل المنتجات');
      }
    });
  }

  /**
   * تحميل الفئات
   */
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.toastr.error('حدث خطأ أثناء تحميل الفئات');
      }
    });
  }

  /**
   * تهيئة النوافذ المنبثقة
   */
  initModals(): void {
    // سيتم تنفيذها لاحقاً عند إضافة Bootstrap
  }

  /**
   * حساب إحصائيات المخزون
   */
  calculateInventoryStats(): void {
    this.totalProducts = this.products.length;
    this.inStockProducts = this.products.filter(p => p.inStock).length;
    this.outOfStockProducts = this.products.filter(p => !p.inStock).length;
    this.lowStockProducts = this.products.filter(p => p.inStock && p.stockQuantity !== undefined && p.stockQuantity < 5).length;
  }

  /**
   * تطبيق الفلترة
   */
  applyFilter(): void {
    let filtered = [...this.products];

    // فلترة حسب البحث
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    // فلترة حسب الفئة
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // فلترة حسب المخزون
    switch (this.stockFilter) {
      case 'inStock':
        filtered = filtered.filter(p => p.inStock);
        break;
      case 'outOfStock':
        filtered = filtered.filter(p => !p.inStock);
        break;
      case 'lowStock':
        filtered = filtered.filter(p => p.inStock && p.stockQuantity !== undefined && p.stockQuantity < 5);
        break;
    }

    // تطبيق ترقيم الصفحات
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredProducts = filtered.slice(startIndex, startIndex + this.pageSize);
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
   * الحصول على اسم الفئة
   */
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === parseInt(categoryId));
    return category ? category.name : 'غير محدد';
  }

  /**
   * فتح نافذة تحديث المخزون
   */
  openUpdateModal(product: Product): void {
    this.selectedProduct = product;
    this.inventoryForm.patchValue({
      id: product.id,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity || 0
    });

    if (this.updateModal) {
      this.updateModal.show();
    }
  }

  /**
   * تحديث المخزون
   */
  updateInventory(): void {
    if (this.inventoryForm.invalid || !this.selectedProduct) {
      return;
    }

    const updatedProduct = {
      ...this.selectedProduct,
      inStock: this.inventoryForm.value.inStock,
      stockQuantity: this.inventoryForm.value.stockQuantity
    };

    this.productService.updateProduct(updatedProduct).subscribe({
      next: () => {
        this.toastr.success('تم تحديث المخزون بنجاح');
        this.loadProducts();
        if (this.updateModal) {
          this.updateModal.hide();
        }
      },
      error: (error) => {
        console.error('Error updating inventory:', error);
        this.toastr.error('حدث خطأ أثناء تحديث المخزون');
      }
    });
  }

  /**
   * تحديث حالة المخزون
   */
  toggleStockStatus(product: Product): void {
    const updatedProduct = {
      ...product,
      inStock: !product.inStock
    };

    this.productService.updateProduct(updatedProduct).subscribe({
      next: () => {
        this.toastr.success(`تم ${updatedProduct.inStock ? 'تفعيل' : 'تعطيل'} المنتج بنجاح`);
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error updating stock status:', error);
        this.toastr.error('حدث خطأ أثناء تحديث حالة المخزون');
      }
    });
  }
}
