import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SettingsService } from '../../../shared/services/settings.service';
import { ToastrService } from '../../../shared/services/toastr.service';
import { StoreSettings } from '../../../shared/interfaces/settings.interface';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  // نموذج الإعدادات
  settingsForm: FormGroup;

  // حالة التحميل
  isLoading = false;

  // الصورة المختارة
  selectedLogo: File | null = null;
  logoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private toastr: ToastrService
  ) {
    // إنشاء نموذج الإعدادات
    this.settingsForm = this.fb.group({
      storeName: ['', [Validators.required]],
      storeEmail: ['', [Validators.required, Validators.email]],
      storePhone: ['', [Validators.required]],
      storeAddress: ['', [Validators.required]],
      storeCity: ['', [Validators.required]],
      storeCountry: ['', [Validators.required]],
      storeZipCode: [''],
      storeCurrency: ['SAR', [Validators.required]],
      storeLanguage: ['ar', [Validators.required]],
      storeDescription: [''],
      storeKeywords: [''],
      storeLogo: [''],
      storeFacebook: [''],
      storeTwitter: [''],
      storeInstagram: [''],
      storeLinkedIn: [''],
      storeYouTube: ['']
    });
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  /**
   * تحميل إعدادات المتجر
   */
  loadSettings(): void {
    this.isLoading = true;
    this.settingsService.getSettings().subscribe({
      next: (settings) => {
        this.settingsForm.patchValue(settings);
        this.logoPreview = settings.storeLogo || null;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading settings:', error);
        this.toastr.error('حدث خطأ أثناء تحميل إعدادات المتجر');
        this.isLoading = false;
      }
    });
  }

  /**
   * معالجة تغيير الشعار
   */
  onLogoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedLogo = input.files[0];

      // عرض معاينة الصورة
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedLogo);
    }
  }

  /**
   * حفظ إعدادات المتجر
   */
  saveSettings(): void {
    if (this.settingsForm.invalid) {
      // تحديد جميع الحقول كـ "تم لمسها" لإظهار رسائل الخطأ
      Object.keys(this.settingsForm.controls).forEach(key => {
        const control = this.settingsForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const settingsData = this.settingsForm.value;

    // إذا تم تحديد شعار جديد، قم برفعه أولاً
    if (this.selectedLogo) {
      this.uploadLogo();
    } else {
      this.updateSettings(settingsData);
    }
  }

  /**
   * رفع الشعار
   */
  uploadLogo(): void {
    if (!this.selectedLogo) return;

    this.settingsService.uploadLogo(this.selectedLogo).subscribe({
      next: (response) => {
        // تحديث مسار الشعار في البيانات
        const settingsData = {
          ...this.settingsForm.value,
          storeLogo: response.logoUrl
        };
        this.updateSettings(settingsData);
      },
      error: (error) => {
        console.error('Error uploading logo:', error);
        this.toastr.error('حدث خطأ أثناء رفع شعار المتجر');
        this.isLoading = false;
      }
    });
  }

  /**
   * تحديث إعدادات المتجر
   */
  updateSettings(settingsData: StoreSettings): void {
    this.settingsService.updateSettings(settingsData).subscribe({
      next: () => {
        this.toastr.success('تم حفظ إعدادات المتجر بنجاح');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating settings:', error);
        this.toastr.error('حدث خطأ أثناء حفظ إعدادات المتجر');
        this.isLoading = false;
      }
    });
  }

  /**
   * إزالة الشعار
   */
  removeLogo(): void {
    this.selectedLogo = null;
    this.logoPreview = null;
    this.settingsForm.patchValue({ storeLogo: '' });
  }
}
