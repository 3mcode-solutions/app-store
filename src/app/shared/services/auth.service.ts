import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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

export interface AuthResponseDto {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private tokenKey = 'auth_token';
  private userKey = 'currentUser';

  constructor(private router: Router, private http: HttpClient) {
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
    return this.http.post<AuthResponseDto>(`${environment.apiUrl}/users/login`, { email, password })
      .pipe(
        tap(response => {
          const user: User = {
            id: response.id,
            name: response.name,
            email: response.email,
            role: response.role,
            avatar: response.avatar,
            token: response.token
          };

          // حفظ بيانات المستخدم في التخزين المحلي
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.userKey, JSON.stringify(user));

          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }),
        map(response => {
          return {
            id: response.id,
            name: response.name,
            email: response.email,
            role: response.role,
            avatar: response.avatar,
            token: response.token
          };
        }),
        catchError(error => {
          console.error('خطأ في تسجيل الدخول', error);

          // معالجة أنواع مختلفة من الأخطاء
          if (error.status === 0) {
            // خطأ في الاتصال بالخادم
            return throwError(() => new Error('لا يمكن الاتصال بالخادم. يرجى التأكد من تشغيل خادم API.'));
          } else if (error.status === 401) {
            // خطأ في المصادقة
            return throwError(() => new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة.'));
          } else if (error.error && typeof error.error === 'string') {
            // رسالة خطأ من الخادم
            return throwError(() => new Error(error.error));
          } else {
            // خطأ غير معروف
            return throwError(() => new Error('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.'));
          }
        })
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
   * تسجيل مستخدم جديد
   */
  register(user: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/register`, user);
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
   * التحقق من صلاحيات المستخدم
   */
  hasRole(requiredRole: string): boolean {
    const user = this.getCurrentUserValue();
    return !!user && user.role === requiredRole;
  }
}
