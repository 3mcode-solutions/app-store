import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // بيانات مؤقتة للمستخدم (ستستبدل بالبيانات الفعلية من API)
  private mockUser: User = {
    id: 1,
    name: 'المدير',
    email: 'admin@example.com',
    role: 'مدير الموقع',
    avatar: 'assets/admin/img/profile-img.jpg'
  };

  constructor(private router: Router) {
    // التحقق من وجود مستخدم مسجل في التخزين المحلي
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  /**
   * تسجيل الدخول
   * @param email البريد الإلكتروني
   * @param password كلمة المرور
   * @returns نتيجة تسجيل الدخول
   */
  login(email: string, password: string): boolean {
    // في الإنتاج، سيتم استبدال هذا بطلب API
    if (email === 'admin@example.com' && password === 'admin123') {
      // تخزين بيانات المستخدم
      localStorage.setItem('currentUser', JSON.stringify(this.mockUser));
      localStorage.setItem('isAuthenticated', 'true');
      
      // تحديث حالة المصادقة
      this.currentUserSubject.next(this.mockUser);
      this.isAuthenticatedSubject.next(true);
      
      return true;
    }
    
    return false;
  }

  /**
   * تسجيل الخروج
   */
  logout(): void {
    // مسح بيانات المستخدم من التخزين المحلي
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    
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
}
