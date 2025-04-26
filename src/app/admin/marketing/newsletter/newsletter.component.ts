import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Subscriber {
  id: number;
  email: string;
  name: string;
  subscriptionDate: Date;
  isActive: boolean;
}

interface Campaign {
  id: number;
  title: string;
  subject: string;
  sentDate: Date;
  recipients: number;
  openRate: number;
  clickRate: number;
}

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {
  subscribers: Subscriber[] = [
    {
      id: 1,
      email: 'ahmed@example.com',
      name: 'أحمد محمد',
      subscriptionDate: new Date(2023, 5, 15),
      isActive: true
    },
    {
      id: 2,
      email: 'sara@example.com',
      name: 'سارة أحمد',
      subscriptionDate: new Date(2023, 6, 20),
      isActive: true
    },
    {
      id: 3,
      email: 'mohamed@example.com',
      name: 'محمد علي',
      subscriptionDate: new Date(2023, 7, 10),
      isActive: false
    },
    {
      id: 4,
      email: 'fatima@example.com',
      name: 'فاطمة حسن',
      subscriptionDate: new Date(2023, 8, 5),
      isActive: true
    },
    {
      id: 5,
      email: 'ali@example.com',
      name: 'علي محمود',
      subscriptionDate: new Date(2023, 9, 12),
      isActive: true
    }
  ];

  campaigns: Campaign[] = [
    {
      id: 1,
      title: 'عروض الصيف',
      subject: 'عروض حصرية لفصل الصيف',
      sentDate: new Date(2023, 5, 20),
      recipients: 1200,
      openRate: 45,
      clickRate: 20
    },
    {
      id: 2,
      title: 'منتجات جديدة',
      subject: 'تشكيلة جديدة من المنتجات',
      sentDate: new Date(2023, 6, 25),
      recipients: 1500,
      openRate: 50,
      clickRate: 25
    },
    {
      id: 3,
      title: 'تخفيضات نهاية العام',
      subject: 'تخفيضات حتى 70% على جميع المنتجات',
      sentDate: new Date(2023, 11, 15),
      recipients: 2000,
      openRate: 60,
      clickRate: 35
    }
  ];

  // نموذج إضافة مشترك جديد
  newSubscriber = {
    email: '',
    name: ''
  };

  // نموذج إنشاء حملة جديدة
  newCampaign = {
    title: '',
    subject: '',
    content: '',
    recipients: 'all' // all, active
  };

  activeTab: 'subscribers' | 'campaigns' | 'new-campaign' = 'subscribers';

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * تبديل التبويب النشط
   */
  setActiveTab(tab: 'subscribers' | 'campaigns' | 'new-campaign'): void {
    this.activeTab = tab;
  }

  /**
   * إضافة مشترك جديد
   */
  addSubscriber(): void {
    if (!this.newSubscriber.email || !this.newSubscriber.name) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newSubscriber.email)) {
      alert('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    // التحقق من عدم وجود البريد الإلكتروني مسبقاً
    if (this.subscribers.some(s => s.email === this.newSubscriber.email)) {
      alert('هذا البريد الإلكتروني مشترك بالفعل');
      return;
    }

    // إضافة المشترك الجديد
    const newId = Math.max(...this.subscribers.map(s => s.id)) + 1;
    this.subscribers.push({
      id: newId,
      email: this.newSubscriber.email,
      name: this.newSubscriber.name,
      subscriptionDate: new Date(),
      isActive: true
    });

    // إعادة تعيين النموذج
    this.newSubscriber = {
      email: '',
      name: ''
    };

    alert('تم إضافة المشترك بنجاح');
  }

  /**
   * تغيير حالة المشترك (نشط/غير نشط)
   */
  toggleSubscriberStatus(id: number): void {
    const index = this.subscribers.findIndex(s => s.id === id);
    if (index !== -1) {
      this.subscribers[index].isActive = !this.subscribers[index].isActive;
    }
  }

  /**
   * حذف مشترك
   */
  deleteSubscriber(id: number): void {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا المشترك؟')) {
      this.subscribers = this.subscribers.filter(s => s.id !== id);
      alert('تم حذف المشترك بنجاح');
    }
  }

  /**
   * إنشاء حملة جديدة
   */
  createCampaign(): void {
    if (!this.newCampaign.title || !this.newCampaign.subject || !this.newCampaign.content) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // حساب عدد المستلمين
    const recipients = this.newCampaign.recipients === 'all'
      ? this.subscribers.length
      : this.subscribers.filter(s => s.isActive).length;

    // إضافة الحملة الجديدة
    const newId = Math.max(...this.campaigns.map(c => c.id)) + 1;
    this.campaigns.push({
      id: newId,
      title: this.newCampaign.title,
      subject: this.newCampaign.subject,
      sentDate: new Date(),
      recipients: recipients,
      openRate: 0,
      clickRate: 0
    });

    // إعادة تعيين النموذج
    this.newCampaign = {
      title: '',
      subject: '',
      content: '',
      recipients: 'all'
    };

    // الانتقال إلى تبويب الحملات
    this.activeTab = 'campaigns';

    alert('تم إنشاء الحملة بنجاح');
  }

  /**
   * حذف حملة
   */
  deleteCampaign(id: number): void {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذه الحملة؟')) {
      this.campaigns = this.campaigns.filter(c => c.id !== id);
      alert('تم حذف الحملة بنجاح');
    }
  }

  /**
   * تنسيق التاريخ
   */
  formatDate(date: Date): string {
    return date.toLocaleDateString('ar-EG');
  }

  /**
   * الحصول على عدد المشتركين النشطين
   */
  getActiveSubscribersCount(): number {
    return this.subscribers.filter(s => s.isActive).length;
  }
}
