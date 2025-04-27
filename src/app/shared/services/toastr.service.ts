import { Injectable } from '@angular/core';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { IndividualConfig } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {
  private defaultOptions: Partial<IndividualConfig> = {
    timeOut: 3000,
    progressBar: true,
    closeButton: true,
    enableHtml: true,
    tapToDismiss: true,
    positionClass: 'toast-top-right'
  };

  constructor(private ngxToastr: NgxToastrService) {
    console.log('ToastrService initialized');
  }

  /**
   * عرض رسالة نجاح
   */
  success(message: string, title: string = 'نجاح'): void {
    console.log('Success:', message);
    try {
      this.ngxToastr.success(message, title, this.defaultOptions);
      console.log('Toast success displayed');
    } catch (error) {
      console.error('Error displaying success toast:', error);
      // استخدام alert كحل بديل في حالة فشل ngx-toastr
      alert(`✅ ${title}: ${message}`);
    }
  }

  /**
   * عرض رسالة خطأ
   */
  error(message: string, title: string = 'خطأ'): void {
    console.error('Error:', message);
    try {
      this.ngxToastr.error(message, title, {
        ...this.defaultOptions,
        timeOut: 5000
      });
      console.log('Toast error displayed');
    } catch (error) {
      console.error('Error displaying error toast:', error);
      // استخدام alert كحل بديل في حالة فشل ngx-toastr
      alert(`❌ ${title}: ${message}`);
    }
  }

  /**
   * عرض رسالة تحذير
   */
  warning(message: string, title: string = 'تحذير'): void {
    console.warn('Warning:', message);
    try {
      this.ngxToastr.warning(message, title, {
        ...this.defaultOptions,
        timeOut: 4000
      });
      console.log('Toast warning displayed');
    } catch (error) {
      console.error('Error displaying warning toast:', error);
      // استخدام alert كحل بديل في حالة فشل ngx-toastr
      alert(`⚠️ ${title}: ${message}`);
    }
  }

  /**
   * عرض رسالة معلومات
   */
  info(message: string, title: string = 'معلومات'): void {
    console.info('Info:', message);
    try {
      this.ngxToastr.info(message, title, this.defaultOptions);
      console.log('Toast info displayed');
    } catch (error) {
      console.error('Error displaying info toast:', error);
      // استخدام alert كحل بديل في حالة فشل ngx-toastr
      alert(`ℹ️ ${title}: ${message}`);
    }
  }

  /**
   * عرض رسالة منبثقة مباشرة (للاختبار)
   */
  showTestToast(): void {
    console.log('Showing test toast');
    try {
      this.ngxToastr.success('هذا اختبار للإشعارات المنبثقة', 'اختبار', this.defaultOptions);
      console.log('Test toast displayed');
    } catch (error) {
      console.error('Error displaying test toast:', error);
      alert('⚠️ فشل في عرض الإشعار المنبثق للاختبار');
    }
  }
}
