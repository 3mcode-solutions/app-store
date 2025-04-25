import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {
  constructor() { }

  /**
   * عرض رسالة نجاح
   */
  success(message: string): void {
    console.log('Success:', message);
    this.showToast(message, 'success');
  }

  /**
   * عرض رسالة خطأ
   */
  error(message: string): void {
    console.error('Error:', message);
    this.showToast(message, 'error');
  }

  /**
   * عرض رسالة تحذير
   */
  warning(message: string): void {
    console.warn('Warning:', message);
    this.showToast(message, 'warning');
  }

  /**
   * عرض رسالة معلومات
   */
  info(message: string): void {
    console.info('Info:', message);
    this.showToast(message, 'info');
  }

  /**
   * عرض رسالة منبثقة
   */
  private showToast(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    // هنا يمكن إضافة منطق لعرض رسائل منبثقة باستخدام مكتبة مثل ngx-toastr
    // حاليًا نستخدم alert بسيط للتوضيح
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    alert(`${icons[type]} ${message}`);
  }
}
