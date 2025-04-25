import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'warning' | 'danger' | 'success' | 'info' | 'primary';
  time: Date;
  isRead: boolean;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([
    {
      id: 1,
      title: 'طلب جديد',
      message: 'تم استلام طلب جديد بقيمة 1200 ريال',
      type: 'warning',
      time: new Date(new Date().getTime() - 30 * 60000), // منذ 30 دقيقة
      isRead: false,
      icon: 'bi-exclamation-circle'
    },
    {
      id: 2,
      title: 'طلب ملغي',
      message: 'تم إلغاء الطلب رقم #2457',
      type: 'danger',
      time: new Date(new Date().getTime() - 2 * 60 * 60000), // منذ ساعتين
      isRead: false,
      icon: 'bi-x-circle'
    },
    {
      id: 3,
      title: 'طلب مكتمل',
      message: 'تم تسليم الطلب رقم #2391',
      type: 'success',
      time: new Date(new Date().getTime() - 3 * 60 * 60000), // منذ 3 ساعات
      isRead: false,
      icon: 'bi-check-circle'
    },
    {
      id: 4,
      title: 'تحديث النظام',
      message: 'تم تحديث النظام إلى الإصدار الجديد',
      type: 'info',
      time: new Date(new Date().getTime() - 4 * 60 * 60000), // منذ 4 ساعات
      isRead: false,
      icon: 'bi-info-circle'
    }
  ]);

  constructor() { }

  /**
   * الحصول على جميع الإشعارات
   */
  getNotifications(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  /**
   * الحصول على عدد الإشعارات غير المقروءة
   */
  getUnreadCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.getNotifications().subscribe(notifications => {
        const count = notifications.filter(n => !n.isRead).length;
        observer.next(count);
      });
    });
  }

  /**
   * إضافة إشعار جديد
   */
  addNotification(notification: Omit<Notification, 'id' | 'time' | 'isRead'>): void {
    const currentNotifications = this.notificationsSubject.getValue();
    const newId = currentNotifications.length > 0 
      ? Math.max(...currentNotifications.map(n => n.id)) + 1 
      : 1;
    
    const newNotification: Notification = {
      ...notification,
      id: newId,
      time: new Date(),
      isRead: false
    };
    
    this.notificationsSubject.next([newNotification, ...currentNotifications]);
  }

  /**
   * تعيين إشعار كمقروء
   */
  markAsRead(id: number): void {
    const notifications = this.notificationsSubject.getValue();
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    
    this.notificationsSubject.next(updatedNotifications);
  }

  /**
   * تعيين جميع الإشعارات كمقروءة
   */
  markAllAsRead(): void {
    const notifications = this.notificationsSubject.getValue();
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    
    this.notificationsSubject.next(updatedNotifications);
  }

  /**
   * حذف إشعار
   */
  removeNotification(id: number): void {
    const notifications = this.notificationsSubject.getValue();
    const updatedNotifications = notifications.filter(n => n.id !== id);
    
    this.notificationsSubject.next(updatedNotifications);
  }

  /**
   * حذف جميع الإشعارات
   */
  clearAll(): void {
    this.notificationsSubject.next([]);
  }
}
