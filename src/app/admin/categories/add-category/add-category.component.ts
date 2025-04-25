import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../shared/services/category.service';
import { ToastrService } from '../../../shared/services/toastr.service';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  // نموذج الفئة
  categoryForm: FormGroup;
  
  // حالة التحميل
  isLoading = false;
  
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {
    // إنشاء نموذج الفئة
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      icon: ['', [Validators.required]],
      featured: [false],
      active: [true]
    });
  }

  ngOnInit(): void {
    // يمكن إضافة أي منطق تهيئة هنا
  }

  /**
   * حفظ الفئة
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

    this.isLoading = true;
    const categoryData = this.categoryForm.value;

    this.categoryService.addCategory(categoryData).subscribe({
      next: () => {
        this.toastr.success('تم إضافة الفئة بنجاح');
        this.resetForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error adding category:', error);
        this.toastr.error('حدث خطأ أثناء إضافة الفئة');
        this.isLoading = false;
      }
    });
  }

  /**
   * إعادة تعيين النموذج
   */
  resetForm(): void {
    this.categoryForm.reset({
      featured: false,
      active: true
    });
  }
}
