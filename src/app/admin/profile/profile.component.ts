import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../shared/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  // نموذج تعديل الملف الشخصي
  profileForm = {
    name: '',
    email: '',
    bio: 'مدير متجر إلكتروني متخصص في إدارة المبيعات والتسويق الإلكتروني.',
    phone: '+966 50 123 4567',
    address: 'الرياض، المملكة العربية السعودية',
    twitter: 'twitter.com/admin',
    facebook: 'facebook.com/admin',
    instagram: 'instagram.com/admin',
    linkedin: 'linkedin.com/in/admin'
  };

  // صورة الملف الشخصي
  profileImage: string | null = null;

  // نموذج تغيير كلمة المرور
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // الحصول على بيانات المستخدم
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;

      if (user) {
        this.profileForm.name = user.name;
        this.profileForm.email = user.email;
        this.profileImage = user.avatar || null;
      }
    });
  }

  /**
   * تحميل صورة الملف الشخصي
   */
  uploadProfileImage(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار صورة صالحة');
        return;
      }

      // قراءة الملف كـ Data URL
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;

        // تحديث صورة المستخدم
        if (this.user) {
          this.user = {
            ...this.user,
            avatar: this.profileImage
          };

          // حفظ التغييرات في التخزين المحلي
          localStorage.setItem('currentUser', JSON.stringify(this.user));

          // إضافة إشعار بتغيير الصورة الشخصية
          this.notificationService.addNotification({
            title: 'تحديث الملف الشخصي',
            message: 'تم تغيير الصورة الشخصية بنجاح',
            type: 'success',
            icon: 'bi-person-check'
          });

          alert('تم تحديث الصورة الشخصية بنجاح');
        }
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * إزالة صورة الملف الشخصي
   */
  removeProfileImage(): void {
    if (confirm('هل أنت متأكد من رغبتك في إزالة الصورة الشخصية؟')) {
      this.profileImage = null;

      // تحديث صورة المستخدم
      if (this.user) {
        this.user = {
          ...this.user,
          avatar: 'assets/admin/img/profile-img.jpg' // استخدام الصورة الافتراضية
        };

        // حفظ التغييرات في التخزين المحلي
        localStorage.setItem('currentUser', JSON.stringify(this.user));

        // إضافة إشعار بإزالة الصورة الشخصية
        this.notificationService.addNotification({
          title: 'تحديث الملف الشخصي',
          message: 'تم إزالة الصورة الشخصية',
          type: 'info',
          icon: 'bi-person'
        });

        alert('تم إزالة الصورة الشخصية بنجاح');
      }
    }
  }

  /**
   * حفظ التغييرات في الملف الشخصي
   */
  saveProfile(): void {
    console.log('Saving profile changes:', this.profileForm);
    // هنا يمكن إضافة منطق حفظ التغييرات
    alert('تم حفظ التغييرات بنجاح');
  }

  /**
   * تغيير كلمة المرور
   */
  changePassword(): void {
    console.log('Changing password:', this.passwordForm);

    // التحقق من تطابق كلمة المرور الجديدة
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      alert('كلمة المرور الجديدة غير متطابقة');
      return;
    }

    // هنا يمكن إضافة منطق تغيير كلمة المرور
    alert('تم تغيير كلمة المرور بنجاح');

    // إعادة تعيين النموذج
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }
}
