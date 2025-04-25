import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Message {
  id: number;
  sender: {
    name: string;
    avatar: string;
  };
  content: string;
  time: Date;
  isRead: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messagesSubject = new BehaviorSubject<Message[]>([
    {
      id: 1,
      sender: {
        name: 'أحمد محمد',
        avatar: 'assets/admin/img/messages-1.jpg'
      },
      content: 'هل يمكنني الحصول على معلومات حول المنتج؟',
      time: new Date(new Date().getTime() - 4 * 60 * 60000), // منذ 4 ساعات
      isRead: false
    },
    {
      id: 2,
      sender: {
        name: 'سارة أحمد',
        avatar: 'assets/admin/img/messages-2.jpg'
      },
      content: 'متى سيتم شحن طلبي؟',
      time: new Date(new Date().getTime() - 6 * 60 * 60000), // منذ 6 ساعات
      isRead: false
    },
    {
      id: 3,
      sender: {
        name: 'محمد علي',
        avatar: 'assets/admin/img/messages-3.jpg'
      },
      content: 'أريد إلغاء طلبي، كيف يمكنني ذلك؟',
      time: new Date(new Date().getTime() - 8 * 60 * 60000), // منذ 8 ساعات
      isRead: false
    }
  ]);

  constructor() { }

  /**
   * الحصول على جميع الرسائل
   */
  getMessages(): Observable<Message[]> {
    return this.messagesSubject.asObservable();
  }

  /**
   * الحصول على عدد الرسائل غير المقروءة
   */
  getUnreadCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.getMessages().subscribe(messages => {
        const count = messages.filter(m => !m.isRead).length;
        observer.next(count);
      });
    });
  }

  /**
   * إضافة رسالة جديدة
   */
  addMessage(message: Omit<Message, 'id' | 'time' | 'isRead'>): void {
    const currentMessages = this.messagesSubject.getValue();
    const newId = currentMessages.length > 0 
      ? Math.max(...currentMessages.map(m => m.id)) + 1 
      : 1;
    
    const newMessage: Message = {
      ...message,
      id: newId,
      time: new Date(),
      isRead: false
    };
    
    this.messagesSubject.next([newMessage, ...currentMessages]);
  }

  /**
   * تعيين رسالة كمقروءة
   */
  markAsRead(id: number): void {
    const messages = this.messagesSubject.getValue();
    const updatedMessages = messages.map(m => 
      m.id === id ? { ...m, isRead: true } : m
    );
    
    this.messagesSubject.next(updatedMessages);
  }

  /**
   * تعيين جميع الرسائل كمقروءة
   */
  markAllAsRead(): void {
    const messages = this.messagesSubject.getValue();
    const updatedMessages = messages.map(m => ({ ...m, isRead: true }));
    
    this.messagesSubject.next(updatedMessages);
  }

  /**
   * حذف رسالة
   */
  removeMessage(id: number): void {
    const messages = this.messagesSubject.getValue();
    const updatedMessages = messages.filter(m => m.id !== id);
    
    this.messagesSubject.next(updatedMessages);
  }

  /**
   * حذف جميع الرسائل
   */
  clearAll(): void {
    this.messagesSubject.next([]);
  }
}
