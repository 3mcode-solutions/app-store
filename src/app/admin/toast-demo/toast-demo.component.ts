import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-toast-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">اختبار الإشعارات المنبثقة</h5>
        <p>انقر على الأزرار أدناه لاختبار الإشعارات المنبثقة المختلفة</p>
        
        <div class="d-flex flex-wrap gap-2 mt-3">
          <button class="btn btn-success" (click)="showSuccess()">نجاح</button>
          <button class="btn btn-danger" (click)="showError()">خطأ</button>
          <button class="btn btn-warning" (click)="showWarning()">تحذير</button>
          <button class="btn btn-info" (click)="showInfo()">معلومات</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      margin-bottom: 20px;
    }
  `]
})
export class ToastDemoComponent implements OnInit {
  
  constructor(private toastr: ToastrService) { }
  
  ngOnInit(): void {
    // عرض إشعار عند تحميل المكون
    setTimeout(() => {
      this.toastr.info('مرحباً بك في صفحة اختبار الإشعارات المنبثقة', 'مرحباً');
    }, 1000);
  }
  
  showSuccess(): void {
    this.toastr.success('تم تنفيذ العملية بنجاح', 'نجاح');
  }
  
  showError(): void {
    this.toastr.error('حدث خطأ أثناء تنفيذ العملية', 'خطأ');
  }
  
  showWarning(): void {
    this.toastr.warning('يرجى الانتباه إلى هذا التحذير', 'تحذير');
  }
  
  showInfo(): void {
    this.toastr.info('هذه معلومة مهمة', 'معلومات');
  }
}
