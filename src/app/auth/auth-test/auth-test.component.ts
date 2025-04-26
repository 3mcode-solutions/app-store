import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { CategoryService } from '../../shared/services/category.service';
import { OrderService } from '../../shared/services/order.service';

@Component({
  selector: 'app-auth-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h3>اختبار المصادقة</h3>
            </div>
            <div class="card-body">
              <div class="mb-4">
                <h4>تسجيل الدخول</h4>
                <div class="form-group mb-3">
                  <label for="email">البريد الإلكتروني</label>
                  <input type="email" class="form-control" id="email" [(ngModel)]="loginForm.email" placeholder="أدخل البريد الإلكتروني">
                </div>
                <div class="form-group mb-3">
                  <label for="password">كلمة المرور</label>
                  <input type="password" class="form-control" id="password" [(ngModel)]="loginForm.password" placeholder="أدخل كلمة المرور">
                </div>
                <button class="btn btn-primary" (click)="login()" [disabled]="isLoading">
                  <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  تسجيل الدخول
                </button>
              </div>

              <div *ngIf="isLoggedIn" class="mb-4">
                <h4>معلومات المستخدم</h4>
                <div class="alert alert-success">
                  <p><strong>الاسم:</strong> {{ currentUser?.name }}</p>
                  <p><strong>البريد الإلكتروني:</strong> {{ currentUser?.email }}</p>
                  <p><strong>الدور:</strong> {{ currentUser?.role }}</p>
                </div>
              </div>

              <div *ngIf="isLoggedIn" class="mb-4">
                <h4>التوكن</h4>
                <div class="alert alert-info">
                  <p class="text-break">{{ token }}</p>
                </div>
              </div>

              <div *ngIf="isLoggedIn" class="mb-4">
                <h4>اختبار الوصول إلى API</h4>
                <div class="d-flex gap-2 mb-3">
                  <button class="btn btn-info" (click)="testUsers()" [disabled]="isTestingUsers">
                    <span *ngIf="isTestingUsers" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    اختبار المستخدمين
                  </button>
                  <button class="btn btn-info" (click)="testCategories()" [disabled]="isTestingCategories">
                    <span *ngIf="isTestingCategories" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    اختبار الفئات
                  </button>
                  <button class="btn btn-info" (click)="testOrders()" [disabled]="isTestingOrders">
                    <span *ngIf="isTestingOrders" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    اختبار الطلبات
                  </button>
                </div>
                <div *ngIf="testResult" [ngClass]="{'alert-success': testSuccess, 'alert-danger': !testSuccess}" class="alert">
                  <pre>{{ testResult | json }}</pre>
                </div>
              </div>

              <div *ngIf="isLoggedIn" class="mb-4">
                <button class="btn btn-danger" (click)="logout()">تسجيل الخروج</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthTestComponent implements OnInit {
  loginForm = {
    email: '',
    password: ''
  };

  isLoading = false;
  isLoggedIn = false;
  currentUser: any = null;
  token: string = '';

  isTestingUsers = false;
  isTestingCategories = false;
  isTestingOrders = false;
  testResult: any = null;
  testSuccess = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private categoryService: CategoryService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // التحقق من وجود مستخدم مسجل الدخول
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.hasUser();
    if (this.isLoggedIn) {
      this.currentUser = this.authService.getCurrentUserValue();
      this.token = this.authService.getToken() || '';
    }
  }

  login(): void {
    this.isLoading = true;
    this.authService.login(this.loginForm.email, this.loginForm.password)
      .subscribe({
        next: (user) => {
          this.isLoading = false;
          this.checkLoginStatus();
          console.log('تم تسجيل الدخول بنجاح', user);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('خطأ في تسجيل الدخول:', error);
          alert('فشل تسجيل الدخول: ' + error.message);
        }
      });
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.currentUser = null;
    this.token = '';
    this.testResult = null;
  }

  testUsers(): void {
    this.isTestingUsers = true;
    this.testResult = null;
    this.userService.getUsers()
      .subscribe({
        next: (users) => {
          this.isTestingUsers = false;
          this.testResult = users;
          this.testSuccess = true;
          console.log('تم الحصول على المستخدمين بنجاح', users);
        },
        error: (error) => {
          this.isTestingUsers = false;
          this.testResult = error;
          this.testSuccess = false;
          console.error('خطأ في الحصول على المستخدمين:', error);
        }
      });
  }

  testCategories(): void {
    this.isTestingCategories = true;
    this.testResult = null;
    this.categoryService.getCategories()
      .subscribe({
        next: (categories) => {
          this.isTestingCategories = false;
          this.testResult = categories;
          this.testSuccess = true;
          console.log('تم الحصول على الفئات بنجاح', categories);
        },
        error: (error) => {
          this.isTestingCategories = false;
          this.testResult = error;
          this.testSuccess = false;
          console.error('خطأ في الحصول على الفئات:', error);
        }
      });
  }

  testOrders(): void {
    this.isTestingOrders = true;
    this.testResult = null;
    this.orderService.getOrders()
      .subscribe({
        next: (orders) => {
          this.isTestingOrders = false;
          this.testResult = orders;
          this.testSuccess = true;
          console.log('تم الحصول على الطلبات بنجاح', orders);
        },
        error: (error) => {
          this.isTestingOrders = false;
          this.testResult = error;
          this.testSuccess = false;
          console.error('خطأ في الحصول على الطلبات:', error);
        }
      });
  }
}
