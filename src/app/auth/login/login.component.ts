import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

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
  returnUrl: string = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // إذا كان المستخدم مسجل الدخول بالفعل، قم بتوجيهه إلى الصفحة الرئيسية
    if (this.authService.hasUser()) {
      this.router.navigate(['/']);
    }

    // الحصول على عنوان URL للعودة من المعلمات أو الصفحة الرئيسية كافتراضي
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    if (!this.isFormValid()) {
      this.showError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    this.isLoading = true;
    this.isError = false;

    this.authService.login(this.loginForm.email, this.loginForm.password)
      .subscribe({
        next: (user) => {
          console.log('تم تسجيل الدخول بنجاح', user);
          this.isLoading = false;
          // توجيه المستخدم إلى الصفحة المطلوبة أو الصفحة الرئيسية
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          this.isLoading = false;
          this.showError(error.message || 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.');
          console.error('خطأ في تسجيل الدخول:', error);
        }
      });
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
