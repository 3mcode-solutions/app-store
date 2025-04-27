import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from '../../services/toastr.service';
import { NotificationToastService } from '../../services/notification-toast.service';

@Component({
  selector: 'app-toast-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">اختبار الإشعارات المنبثقة</h5>
        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-success" (click)="showSuccessToast()">نجاح</button>
          <button class="btn btn-danger" (click)="showErrorToast()">خطأ</button>
          <button class="btn btn-warning" (click)="showWarningToast()">تحذير</button>
          <button class="btn btn-info" (click)="showInfoToast()">معلومات</button>
          <button class="btn btn-primary" (click)="showAddNotification()">إضافة</button>
          <button class="btn btn-secondary" (click)="showUpdateNotification()">تعديل</button>
          <button class="btn btn-dark" (click)="showDeleteNotification()">حذف</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      margin: 20px;
    }
    .card-title {
      margin-bottom: 20px;
    }
  `]
})
export class ToastTestComponent {
  constructor(
    private toastr: ToastrService,
    private notificationToast: NotificationToastService
  ) {}

  showSuccessToast(): void {
    this.toastr.success('تم تنفيذ العملية بنجاح', 'نجاح');
  }

  showErrorToast(): void {
    this.toastr.error('حدث خطأ أثناء تنفيذ العملية', 'خطأ');
  }

  showWarningToast(): void {
    this.toastr.warning('يرجى الانتباه إلى هذا التحذير', 'تحذير');
  }

  showInfoToast(): void {
    this.toastr.info('هذه معلومة مهمة', 'معلومات');
  }

  showAddNotification(): void {
    this.notificationToast.showAddSuccess('عنصر', 'اسم العنصر');
  }

  showUpdateNotification(): void {
    this.notificationToast.showUpdateSuccess('عنصر', 'اسم العنصر');
  }

  showDeleteNotification(): void {
    this.notificationToast.showDeleteSuccess('عنصر', 'اسم العنصر');
  }
}
