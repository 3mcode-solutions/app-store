import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product } from '../../shared/interfaces/product.interface';
import { Category } from '../../shared/interfaces/category.interface';
import { ProductService } from '../../shared/services/product.service';
import { CategoryService } from '../../shared/services/category.service';
import { ToastrService } from '../../shared/services/toastr.service';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  // بيانات المنتجات
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProduct: Product | null = null;

  // إحصائيات المنتجات
  totalProductsCount = 0;
  inStockCount = 0;
  outOfStockCount = 0;
  inStockPercentage = 0;
  outOfStockPercentage = 0;
  averageRating = 0;

  // بيانات الفئات
  categories: Category[] = [];

  // نموذج المنتج
  productForm: FormGroup;
  isEditMode = false;

  // فلترة وترتيب
  searchTerm = '';
  selectedCategory = '';
  sortBy = 'id';

  // ترقيم الصفحات
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // النوافذ المنبثقة
  productModal: any;
  deleteModal: any;
  detailsModal: any;
  productModalTitle = 'إضافة منتج جديد';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {
    // إنشاء نموذج المنتج
    this.productForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      imageUrl: ['', [Validators.required]],
      category: ['', [Validators.required]],
      inStock: [true],
      stockQuantity: [0, [Validators.min(0)]],
      featured: [false],
      rating: [0, [Validators.min(0), Validators.max(5)]],
      discount: [0, [Validators.min(0), Validators.max(100)]]
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
        this.calculateStatistics();
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.toastr.error('حدث خطأ أثناء تحميل المنتجات');
      }
    });
  }

  /**
   * حساب إحصائيات المنتجات
   */
  calculateStatistics(): void {
    // إجمالي المنتجات
    this.totalProductsCount = this.products.length;

    // المنتجات المتوفرة وغير المتوفرة
    this.inStockCount = this.products.filter(p => p.inStock).length;
    this.outOfStockCount = this.totalProductsCount - this.inStockCount;

    // النسب المئوية
    this.inStockPercentage = this.totalProductsCount > 0
      ? Math.round((this.inStockCount / this.totalProductsCount) * 100)
      : 0;
    this.outOfStockPercentage = this.totalProductsCount > 0
      ? Math.round((this.outOfStockCount / this.totalProductsCount) * 100)
      : 0;

    // متوسط التقييم
    const totalRating = this.products.reduce((sum, product) => sum + (product.rating || 0), 0);
    this.averageRating = this.totalProductsCount > 0
      ? totalRating / this.totalProductsCount
      : 0;
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
    setTimeout(() => {
      this.productModal = new bootstrap.Modal(document.getElementById('productModal'));
      this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
      this.detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    }, 500);
  }

  /**
   * تطبيق الفلترة والترتيب
   */
  applyFilter(): void {
    // تطبيق الفلترة
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm ||
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // تطبيق الترتيب
    this.sortProducts();

    // حساب عدد الصفحات
    this.calculatePagination();
  }

  /**
   * ترتيب المنتجات
   */
  sortProducts(): void {
    switch (this.sortBy) {
      case 'name':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'priceAsc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'stock':
        this.filteredProducts.sort((a, b) => (a.inStock === b.inStock) ? 0 : a.inStock ? -1 : 1);
        break;
      default:
        this.filteredProducts.sort((a, b) => a.id - b.id);
        break;
    }
  }

  /**
   * حساب ترقيم الصفحات
   */
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);

    // تعديل الصفحة الحالية إذا كانت خارج النطاق
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }

    // تطبيق ترقيم الصفحات
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredProducts = this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
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
   * الحصول على اسم الفئة من معرفها
   */
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === parseInt(categoryId, 10));
    return category ? category.name : 'غير محدد';
  }

  /**
   * فتح نافذة إضافة منتج جديد
   */
  openAddProductModal(): void {
    this.isEditMode = false;
    this.productForm.reset({
      inStock: true,
      stockQuantity: 0,
      featured: false,
      price: 0,
      discount: 0,
      rating: 0
    });
    this.productModalTitle = 'إضافة منتج جديد';
    this.productModal.show();
  }

  /**
   * فتح نافذة تعديل منتج
   */
  editProduct(product: Product): void {
    this.isEditMode = true;
    this.selectedProduct = product;

    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity || 0,
      featured: product.featured || false,
      rating: product.rating || 0,
      discount: product.discount || 0
    });

    this.productModalTitle = 'تعديل منتج';
    this.productModal.show();
  }

  /**
   * حفظ المنتج (إضافة أو تعديل)
   */
  saveProduct(): void {
    if (this.productForm.invalid) {
      // تحديد جميع الحقول كـ "تم لمسها" لإظهار رسائل الخطأ
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const productData = this.productForm.value;

    if (this.isEditMode) {
      // تعديل منتج موجود
      this.productService.updateProduct(productData).subscribe({
        next: () => {
          this.toastr.success('تم تعديل المنتج بنجاح');
          this.loadProducts();
          this.productModal.hide();
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.toastr.error('حدث خطأ أثناء تعديل المنتج');
        }
      });
    } else {
      // إضافة منتج جديد
      this.productService.addProduct(productData).subscribe({
        next: () => {
          this.toastr.success('تم إضافة المنتج بنجاح');
          this.loadProducts();
          this.productModal.hide();
        },
        error: (error) => {
          console.error('Error adding product:', error);
          this.toastr.error('حدث خطأ أثناء إضافة المنتج');
        }
      });
    }
  }

  /**
   * فتح نافذة حذف منتج
   */
  deleteProduct(product: Product): void {
    this.selectedProduct = product;
    this.deleteModal.show();
  }

  /**
   * تأكيد حذف المنتج
   */
  confirmDelete(): void {
    if (!this.selectedProduct) return;

    this.productService.deleteProduct(this.selectedProduct.id).subscribe({
      next: () => {
        this.toastr.success('تم حذف المنتج بنجاح');
        this.loadProducts();
        this.deleteModal.hide();
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.toastr.error('حدث خطأ أثناء حذف المنتج');
      }
    });
  }

  /**
   * عرض تفاصيل المنتج
   */
  viewProductDetails(product: Product): void {
    this.selectedProduct = product;
    this.detailsModal.show();
  }

  /**
   * فتح نافذة تحميل الصور
   */
  openImageUploader(): void {
    // في الواقع، هنا يمكن استخدام مكتبة لتحميل الصور مثل ngx-dropzone
    // لكن للتبسيط، سنستخدم مربع حوار لإدخال رابط الصورة
    const imageUrl = prompt('أدخل رابط الصورة:');
    if (imageUrl) {
      this.productForm.patchValue({ imageUrl });
    }
  }
}
