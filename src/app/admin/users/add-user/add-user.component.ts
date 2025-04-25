import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { ToastrService } from '../../../shared/services/toastr.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  // نموذج المستخدم
  userForm: FormGroup;
  
  // حالة التحميل
  isLoading = false;
  
  // قائمة الأدوار
  roles = [
    { id: 'admin', name: 'مدير' },
    { id: 'editor', name: 'محرر' },
    { id: 'customer', name: 'عميل' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    // إنشاء نموذج المستخدم
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      role: ['customer', [Validators.required]],
      active: [true]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // يمكن إضافة أي منطق تهيئة هنا
  }

  /**
   * التحقق من تطابق كلمة المرور
   */
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  /**
   * حفظ المستخدم
   */
  saveUser(): void {
    if (this.userForm.invalid) {
      // تحديد جميع الحقول كـ "تم لمسها" لإظهار رسائل الخطأ
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const userData = { ...this.userForm.value };
    delete userData.confirmPassword; // حذف حقل تأكيد كلمة المرور قبل الإرسال

    this.userService.addUser(userData).subscribe({
      next: () => {
        this.toastr.success('تم إضافة المستخدم بنجاح');
        this.resetForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error adding user:', error);
        this.toastr.error('حدث خطأ أثناء إضافة المستخدم');
        this.isLoading = false;
      }
    });
  }

  /**
   * إعادة تعيين النموذج
   */
  resetForm(): void {
    this.userForm.reset({
      role: 'customer',
      active: true
    });
  }
}
