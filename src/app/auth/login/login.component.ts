import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = {
    email: '',
    password: ''
  };

  // إضافة المتغيرات الجديدة
  showPassword = false;
  rememberMe = false;
  isLoading = false;
  isError = false;
  errorMessage = '';

  onSubmit() {
    if (!this.isFormValid()) {
      this.showError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    this.isLoading = true;
    this.isError = false;

    // محاكاة عملية تسجيل الدخول
    setTimeout(() => {
      this.isLoading = false;
      if (this.loginForm.email === 'admin@example.com' && this.loginForm.password === 'password') {
        // تم تسجيل الدخول بنجاح
        console.log('تم تسجيل الدخول بنجاح');
      } else {
        this.showError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    }, 1500);
  }

  private isFormValid(): boolean {
    return (
      this.loginForm.email.trim() !== '' &&
      this.loginForm.password.trim() !== '' &&
      this.isValidEmail(this.loginForm.email)
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * إظهار/إخفاء كلمة المرور
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /**
   * عرض رسالة خطأ
   */
  private showError(message: string) {
    this.isError = true;
    this.errorMessage = message;
    setTimeout(() => {
      this.isError = false;
      this.errorMessage = '';
    }, 3000);
  }
}
