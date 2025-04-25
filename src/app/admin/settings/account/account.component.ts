import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountSettingsComponent implements OnInit {
  user: User | null = null;
  
  // إعدادات الحساب
  accountSettings = {
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    productNotifications: true,
    marketingNotifications: false,
    twoFactorAuth: false,
    language: 'ar',
    timezone: 'Asia/Riyadh',
    dateFormat: 'dd/MM/yyyy',
    theme: 'light'
  };
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // الحصول على بيانات المستخدم
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }
  
  /**
   * حفظ إعدادات الحساب
   */
  saveAccountSettings(): void {
    console.log('Saving account settings:', this.accountSettings);
    // هنا يمكن إضافة منطق حفظ الإعدادات
    alert('تم حفظ الإعدادات بنجاح');
  }
  
  /**
   * تفعيل المصادقة الثنائية
   */
  enableTwoFactorAuth(): void {
    this.accountSettings.twoFactorAuth = true;
    alert('تم تفعيل المصادقة الثنائية بنجاح');
  }
  
  /**
   * تعطيل المصادقة الثنائية
   */
  disableTwoFactorAuth(): void {
    this.accountSettings.twoFactorAuth = false;
    alert('تم تعطيل المصادقة الثنائية بنجاح');
  }
}
