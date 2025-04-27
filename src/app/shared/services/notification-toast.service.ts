import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationToastService {
  constructor(
    private toastr: ToastrService,
    private notificationService: NotificationService
  ) { }

  /**
   * عرض إشعار عند إضافة عنصر
   */
  showAddSuccess(itemType: string, itemName: string): void {
    const message = `تم إضافة ${itemType} "${itemName}" بنجاح`;
    const title = 'تمت الإضافة';

    // عرض إشعار منبثق
    this.toastr.success(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true
    });

    // إضافة إشعار إلى قائمة الإشعارات
    this.notificationService.addNotification({
      title: title,
      message: message,
      type: 'success',
      icon: 'check-circle'
    });
  }

  /**
   * عرض إشعار عند تعديل عنصر
   */
  showUpdateSuccess(itemType: string, itemName: string): void {
    const message = `تم تعديل ${itemType} "${itemName}" بنجاح`;
    const title = 'تم التعديل';

    // عرض إشعار منبثق
    this.toastr.success(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true
    });

    // إضافة إشعار إلى قائمة الإشعارات
    this.notificationService.addNotification({
      title: title,
      message: message,
      type: 'info',
      icon: 'pencil'
    });
  }

  /**
   * عرض إشعار عند حذف عنصر
   */
  showDeleteSuccess(itemType: string, itemName: string): void {
    const message = `تم حذف ${itemType} "${itemName}" بنجاح`;
    const title = 'تم الحذف';

    // عرض إشعار منبثق
    this.toastr.success(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true
    });

    // إضافة إشعار إلى قائمة الإشعارات
    this.notificationService.addNotification({
      title: title,
      message: message,
      type: 'warning',
      icon: 'trash'
    });
  }

  /**
   * عرض إشعار عند حدوث خطأ
   */
  showError(message: string, title: string = 'خطأ'): void {
    // عرض إشعار منبثق
    this.toastr.error(message, title, {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true
    });

    // إضافة إشعار إلى قائمة الإشعارات
    this.notificationService.addNotification({
      title: title,
      message: message,
      type: 'danger',
      icon: 'exclamation-triangle'
    });
  }

  /**
   * عرض إشعار معلومات
   */
  showInfo(message: string, title: string = 'معلومات'): void {
    // عرض إشعار منبثق
    this.toastr.info(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true
    });

    // إضافة إشعار إلى قائمة الإشعارات
    this.notificationService.addNotification({
      title: title,
      message: message,
      type: 'info',
      icon: 'info-circle'
    });
  }

  /**
   * عرض إشعار تحذير
   */
  showWarning(message: string, title: string = 'تحذير'): void {
    // عرض إشعار منبثق
    this.toastr.warning(message, title, {
      timeOut: 4000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true
    });

    // إضافة إشعار إلى قائمة الإشعارات
    this.notificationService.addNotification({
      title: title,
      message: message,
      type: 'warning',
      icon: 'exclamation-circle'
    });
  }
}
