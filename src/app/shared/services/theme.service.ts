import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeType = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<ThemeType>(this.getStoredTheme());
  private systemDarkMode: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // التحقق من وجود المتصفح
    if (isPlatformBrowser(this.platformId)) {
      // الاستماع لتغييرات سمة النظام
      this.listenForSystemThemeChanges();
      
      // تطبيق السمة المخزنة
      this.applyTheme(this.getStoredTheme());
    }
  }

  /**
   * الحصول على السمة الحالية
   */
  getTheme(): Observable<ThemeType> {
    return this.themeSubject.asObservable();
  }

  /**
   * تعيين السمة
   */
  setTheme(theme: ThemeType): void {
    // تخزين السمة في التخزين المحلي
    localStorage.setItem('theme', theme);
    
    // تحديث السمة
    this.themeSubject.next(theme);
    
    // تطبيق السمة
    this.applyTheme(theme);
  }

  /**
   * الحصول على السمة المخزنة
   */
  private getStoredTheme(): ThemeType {
    if (isPlatformBrowser(this.platformId)) {
      const storedTheme = localStorage.getItem('theme') as ThemeType;
      return storedTheme || 'light';
    }
    return 'light';
  }

  /**
   * الاستماع لتغييرات سمة النظام
   */
  private listenForSystemThemeChanges(): void {
    // التحقق من دعم المتصفح لوسائط الاستعلام
    if (window.matchMedia) {
      // التحقق من تفضيل المستخدم للسمة الداكنة
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // تحديث حالة السمة الداكنة للنظام
      this.systemDarkMode = darkModeMediaQuery.matches;
      
      // الاستماع لتغييرات تفضيل المستخدم
      darkModeMediaQuery.addEventListener('change', (e) => {
        this.systemDarkMode = e.matches;
        
        // إذا كانت السمة الحالية هي "system"، قم بتطبيق السمة الجديدة
        if (this.themeSubject.getValue() === 'system') {
          this.applySystemTheme();
        }
      });
    }
  }

  /**
   * تطبيق السمة
   */
  private applyTheme(theme: ThemeType): void {
    if (isPlatformBrowser(this.platformId)) {
      if (theme === 'system') {
        this.applySystemTheme();
      } else {
        this.document.documentElement.setAttribute('data-bs-theme', theme);
        this.document.body.classList.remove('theme-dark', 'theme-light');
        this.document.body.classList.add(`theme-${theme}`);
      }
    }
  }

  /**
   * تطبيق سمة النظام
   */
  private applySystemTheme(): void {
    const theme = this.systemDarkMode ? 'dark' : 'light';
    this.document.documentElement.setAttribute('data-bs-theme', theme);
    this.document.body.classList.remove('theme-dark', 'theme-light');
    this.document.body.classList.add(`theme-${theme}`);
  }
}
