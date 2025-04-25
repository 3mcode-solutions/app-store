import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { CategoryService } from '../../../shared/services/category.service';
import { ToastrService } from '../../../shared/services/toastr.service';
import { Category } from '../../../shared/interfaces/category.interface';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  // نموذج المنتج
  productForm: FormGroup;
  
  // بيانات الفئات
  categories: Category[] = [];
  
  // حالة التحميل
  isLoading = false;
  
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {
    // إنشاء نموذج المنتج
    this.productForm = this.fb.group({
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
    // تحميل الفئات
    this.loadCategories();
  }

  /**
   * تحميل الفئات
   */
  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error loading categories:', error);
        this.toastr.error('حدث خطأ أثناء تحميل الفئات');
      }
    );
  }

  /**
   * حفظ المنتج
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

    this.isLoading = true;
    const productData = this.productForm.value;

    this.productService.addProduct(productData).subscribe({
      next: () => {
        this.toastr.success('تم إضافة المنتج بنجاح');
        this.resetForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error adding product:', error);
        this.toastr.error('حدث خطأ أثناء إضافة المنتج');
        this.isLoading = false;
      }
    });
  }

  /**
   * إعادة تعيين النموذج
   */
  resetForm(): void {
    this.productForm.reset({
      inStock: true,
      stockQuantity: 0,
      featured: false,
      price: 0,
      discount: 0,
      rating: 0
    });
  }
}
