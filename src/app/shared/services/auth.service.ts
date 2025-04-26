import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  token?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private tokenKey = 'auth_token';
  private userKey = 'currentUser';

  constructor(private router: Router, private apiService: ApiService) {
    // التحقق من وجود مستخدم مسجل في التخزين المحلي
    this.loadUserFromStorage();
  }

  /**
   * تحميل بيانات المستخدم من التخزين المحلي
   */
  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem(this.userKey);
    const token = localStorage.getItem(this.tokenKey);

    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser) as User;
        user.token = token;
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        console.error('خطأ في تحليل بيانات المستخدم المخزنة', error);
        this.logout();
      }
    }
  }

  /**
   * تسجيل الدخول
   * @param email البريد الإلكتروني
   * @param password كلمة المرور
   * @returns Observable مع نتيجة تسجيل الدخول
   */
  login(email: string, password: string): Observable<User> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      // محاكاة طلب API
      return of({
        user: {
          id: 1,
          name: 'المدير',
          email: 'admin@example.com',
          role: 'مدير الموقع',
          avatar: 'assets/admin/img/profile-img.jpg'
        },
        token: 'mock-jwt-token',
        message: 'تم تسجيل الدخول بنجاح'
      } as LoginResponse).pipe(
        tap(response => {
          if (email === 'admin@example.com' && password === 'admin123') {
            const user = response.user;
            user.token = response.token;

            // حفظ بيانات المستخدم في التخزين المحلي
            localStorage.setItem(this.tokenKey, response.token);
            localStorage.setItem(this.userKey, JSON.stringify(user));

            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
          } else {
            throw new Error('بيانات تسجيل الدخول غير صحيحة');
          }
        }),
        map(response => response.user),
        catchError(error => {
          console.error('خطأ في تسجيل الدخول', error);
          return throwError(() => new Error('بيانات تسجيل الدخول غير صحيحة'));
        })
      );
    }

    // استخدام API حقيقي
    return this.apiService.post<LoginResponse>('auth/login', { email, password })
      .pipe(
        tap(response => {
          const user = response.user;
          user.token = response.token;

          // حفظ بيانات المستخدم في التخزين المحلي
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.userKey, JSON.stringify(user));

          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }),
        map(response => response.user)
      );
  }

  /**
   * تسجيل الخروج
   */
  logout(): void {
    // مسح بيانات المستخدم من التخزين المحلي
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);

    // تحديث حالة المصادقة
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    // توجيه المستخدم إلى صفحة تسجيل الدخول
    this.router.navigate(['/auth/login']);
  }

  /**
   * الحصول على المستخدم الحالي
   */
  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  /**
   * الحصول على المستخدم الحالي مباشرة
   */
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.getValue();
  }

  /**
   * الحصول على حالة المصادقة
   */
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  /**
   * التحقق من وجود مستخدم مسجل
   */
  hasUser(): boolean {
    return this.currentUserSubject.getValue() !== null;
  }

  /**
   * الحصول على رمز المصادقة (token)
   */
  getToken(): string | null {
    return this.currentUserSubject.getValue()?.token || null;
  }

  /**
   * التحقق من صلاحية الرمز
   */
  validateToken(): Observable<boolean> {
    const token = this.getToken();

    if (!token) {
      return of(false);
    }

    // في حالة عدم وجود API حقيقي
    if (!environment.production) {
      // محاكاة التحقق من الرمز
      return of(true);
    }

    return this.apiService.get<{ valid: boolean }>('auth/validate-token')
      .pipe(
        map(response => response.valid),
        catchError(() => of(false))
      );
  }

  /**
   * التحقق من صلاحيات المستخدم
   */
  hasRole(requiredRole: string): boolean {
    const user = this.getCurrentUserValue();
    return !!user && user.role === requiredRole;
  }
}
