import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.authService.isAuthenticated().pipe(
      take(1),
      map(isAuthenticated => {
        // التحقق من حالة المصادقة
        if (!isAuthenticated) {
          // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
          this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }

        // التحقق من الأدوار المطلوبة
        const requiredRoles = route.data['roles'] as Array<string>;
        if (requiredRoles && requiredRoles.length > 0) {
          const currentUser = this.authService.getCurrentUserValue();
          
          // التحقق من أن المستخدم لديه دور مطلوب
          if (!currentUser || !requiredRoles.includes(currentUser.role)) {
            // إعادة توجيه المستخدم إلى صفحة غير مصرح بها
            this.router.navigate(['/unauthorized']);
            return false;
          }
        }

        return true;
      })
    );
  }
}
