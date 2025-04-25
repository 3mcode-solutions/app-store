import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService, Notification } from '../../shared/services/notification.service';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  activeFilter: 'all' | 'unread' | 'read' = 'all';
  hasUnreadNotifications: boolean = false;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    // الحصول على الإشعارات
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
      this.hasUnreadNotifications = notifications.some(n => !n.isRead);
      this.applyFilter(this.activeFilter);
    });
  }

  /**
   * تطبيق فلتر على الإشعارات
   */
  applyFilter(filter: 'all' | 'unread' | 'read'): void {
    this.activeFilter = filter;

    switch (filter) {
      case 'all':
        this.filteredNotifications = this.notifications;
        break;
      case 'unread':
        this.filteredNotifications = this.notifications.filter(n => !n.isRead);
        break;
      case 'read':
        this.filteredNotifications = this.notifications.filter(n => n.isRead);
        break;
    }
  }

  /**
   * تعيين إشعار كمقروء
   */
  markAsRead(id: number): void {
    this.notificationService.markAsRead(id);

    // تحديث حالة وجود إشعارات غير مقروءة
    const stillHasUnread = this.notifications.some(n => n.id !== id && !n.isRead);
    this.hasUnreadNotifications = stillHasUnread;
  }

  /**
   * تعيين جميع الإشعارات كمقروءة
   */
  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
    this.hasUnreadNotifications = false;
  }

  /**
   * حذف إشعار
   */
  removeNotification(id: number): void {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا الإشعار؟')) {
      this.notificationService.removeNotification(id);
    }
  }

  /**
   * حذف جميع الإشعارات
   */
  clearAllNotifications(): void {
    if (confirm('هل أنت متأكد من رغبتك في حذف جميع الإشعارات؟')) {
      this.notificationService.clearAll();
    }
  }

  /**
   * تحويل التاريخ إلى نص يوضح الوقت المنقضي
   */
  getTimeAgo(date: Date): string {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) {
      return 'منذ لحظات';
    } else if (diffMin < 60) {
      return `منذ ${diffMin} دقيقة`;
    } else if (diffHour < 24) {
      return `منذ ${diffHour} ساعة`;
    } else if (diffDay < 30) {
      return `منذ ${diffDay} يوم`;
    } else {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }

  /**
   * الحصول على لون الإشعار حسب نوعه
   */
  getNotificationColor(type: string): string {
    switch (type) {
      case 'success': return 'success';
      case 'danger': return 'danger';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'primary';
    }
  }
}
