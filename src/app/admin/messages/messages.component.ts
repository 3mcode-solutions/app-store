import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService, Message } from '../../shared/services/message.service';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  filteredMessages: Message[] = [];
  activeFilter: 'all' | 'unread' | 'read' = 'all';
  hasUnreadMessages: boolean = false;
  unreadMessagesCount: number = 0;
  readMessagesCount: number = 0;

  // نموذج الرسالة الجديدة
  newMessage = {
    recipient: '',
    content: ''
  };

  // قائمة المستلمين (للعرض فقط)
  recipients = [
    { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com' },
    { id: 2, name: 'سارة أحمد', email: 'sara@example.com' },
    { id: 3, name: 'محمد علي', email: 'mohamed@example.com' },
    { id: 4, name: 'فاطمة حسن', email: 'fatima@example.com' }
  ];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    // الحصول على الرسائل
    this.messageService.getMessages().subscribe(messages => {
      this.messages = messages;
      this.hasUnreadMessages = messages.some(m => !m.isRead);
      this.unreadMessagesCount = messages.filter(m => !m.isRead).length;
      this.readMessagesCount = messages.filter(m => m.isRead).length;
      this.applyFilter(this.activeFilter);
    });
  }

  /**
   * تطبيق فلتر على الرسائل
   */
  applyFilter(filter: 'all' | 'unread' | 'read'): void {
    this.activeFilter = filter;

    switch (filter) {
      case 'all':
        this.filteredMessages = this.messages;
        break;
      case 'unread':
        this.filteredMessages = this.messages.filter(m => !m.isRead);
        break;
      case 'read':
        this.filteredMessages = this.messages.filter(m => m.isRead);
        break;
    }
  }

  /**
   * تعيين رسالة كمقروءة
   */
  markAsRead(id: number): void {
    this.messageService.markAsRead(id);

    // تحديث حالة وجود رسائل غير مقروءة
    const stillHasUnread = this.messages.some(m => m.id !== id && !m.isRead);
    this.hasUnreadMessages = stillHasUnread;

    // تحديث عدد الرسائل المقروءة وغير المقروءة
    this.unreadMessagesCount = this.messages.filter(m => !m.isRead).length;
    this.readMessagesCount = this.messages.filter(m => m.isRead).length;
  }

  /**
   * تعيين جميع الرسائل كمقروءة
   */
  markAllAsRead(): void {
    this.messageService.markAllAsRead();
    this.hasUnreadMessages = false;

    // تحديث عدد الرسائل المقروءة وغير المقروءة
    this.unreadMessagesCount = 0;
    this.readMessagesCount = this.messages.length;
  }

  /**
   * حذف رسالة
   */
  removeMessage(id: number): void {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذه الرسالة؟')) {
      this.messageService.removeMessage(id);
    }
  }

  /**
   * حذف جميع الرسائل
   */
  clearAllMessages(): void {
    if (confirm('هل أنت متأكد من رغبتك في حذف جميع الرسائل؟')) {
      this.messageService.clearAll();
    }
  }

  /**
   * إرسال رسالة جديدة
   */
  sendMessage(): void {
    if (!this.newMessage.recipient || !this.newMessage.content) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // البحث عن المستلم
    const recipient = this.recipients.find(r => r.id.toString() === this.newMessage.recipient);

    if (!recipient) {
      alert('يرجى اختيار مستلم صالح');
      return;
    }

    // إضافة رسالة جديدة (للعرض فقط - في التطبيق الحقيقي ستكون رسالة صادرة)
    this.messageService.addMessage({
      sender: {
        name: recipient.name,
        avatar: 'assets/admin/img/profile-img.jpg'
      },
      content: this.newMessage.content
    });

    // إعادة تعيين النموذج
    this.newMessage = {
      recipient: '',
      content: ''
    };

    alert('تم إرسال الرسالة بنجاح');
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
}
