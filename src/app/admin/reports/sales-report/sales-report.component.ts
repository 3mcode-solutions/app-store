import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReportService } from '../../../shared/services/report.service';
import { ToastrService } from '../../../shared/services/toastr.service';
import { SalesData } from '../../../shared/interfaces/report.interface';

// استيراد Chart.js
declare var Chart: any;

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css']
})
export class SalesReportComponent implements OnInit, AfterViewInit {
  @ViewChild('salesChart') salesChartRef!: ElementRef;
  @ViewChild('productChart') productChartRef!: ElementRef;

  // بيانات المبيعات
  salesData: SalesData | null = null;

  // فلترة التقارير
  dateRange = 'month'; // day, week, month, year, custom
  startDate = '';
  endDate = '';

  // حالة التحميل
  isLoading = false;

  // الرسوم البيانية
  salesChart: any;
  productChart: any;

  constructor(
    private reportService: ReportService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initDateRange();
    this.loadSalesData();
  }

  ngAfterViewInit(): void {
    // سيتم إنشاء الرسوم البيانية بعد تحميل البيانات
  }

  /**
   * تهيئة نطاق التاريخ
   */
  initDateRange(): void {
    const today = new Date();
    const endDate = new Date(today);
    let startDate = new Date(today);

    // تعيين تاريخ البداية حسب النطاق المحدد
    switch (this.dateRange) {
      case 'day':
        // اليوم الحالي
        break;
      case 'week':
        // الأسبوع الحالي
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        // الشهر الحالي
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'year':
        // السنة الحالية
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
    }

    this.startDate = this.formatDateForInput(startDate);
    this.endDate = this.formatDateForInput(endDate);
  }

  /**
   * تنسيق التاريخ لحقل الإدخال
   */
  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * تغيير نطاق التاريخ
   */
  onDateRangeChange(): void {
    if (this.dateRange !== 'custom') {
      this.initDateRange();
    }
    this.loadSalesData();
  }

  /**
   * تحميل بيانات المبيعات
   */
  loadSalesData(): void {
    this.isLoading = true;

    this.reportService.getSalesData(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.salesData = data;
        this.initCharts();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading sales data:', error);
        this.toastr.error('حدث خطأ أثناء تحميل بيانات المبيعات');
        this.isLoading = false;
      }
    });
  }

  /**
   * تهيئة الرسوم البيانية
   */
  initCharts(): void {
    if (!this.salesData) return;

    // تهيئة رسم بياني المبيعات
    this.initSalesChart();

    // تهيئة رسم بياني المنتجات الأكثر مبيعاً
    this.initProductChart();
  }

  /**
   * تهيئة رسم بياني المبيعات
   */
  initSalesChart(): void {
    if (!this.salesData || !this.salesChartRef) return;

    const ctx = this.salesChartRef.nativeElement.getContext('2d');

    // تدمير الرسم البياني السابق إذا كان موجوداً
    if (this.salesChart) {
      this.salesChart.destroy();
    }

    // إنشاء رسم بياني جديد
    this.salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.salesData.timeline.map(item => item.date),
        datasets: [
          {
            label: 'المبيعات',
            data: this.salesData.timeline.map(item => item.sales),
            borderColor: '#4154f1',
            backgroundColor: 'rgba(65, 84, 241, 0.2)',
            borderWidth: 2,
            fill: true
          },
          {
            label: 'الطلبات',
            data: this.salesData.timeline.map(item => item.orders),
            borderColor: '#2eca6a',
            backgroundColor: 'rgba(46, 202, 106, 0.2)',
            borderWidth: 2,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        }
      }
    });
  }

  /**
   * تهيئة رسم بياني المنتجات الأكثر مبيعاً
   */
  initProductChart(): void {
    if (!this.salesData || !this.productChartRef) return;

    const ctx = this.productChartRef.nativeElement.getContext('2d');

    // تدمير الرسم البياني السابق إذا كان موجوداً
    if (this.productChart) {
      this.productChart.destroy();
    }

    // إنشاء رسم بياني جديد
    this.productChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.salesData.topProducts.map(product => product.name),
        datasets: [
          {
            label: 'المبيعات',
            data: this.salesData.topProducts.map(product => product.sales),
            backgroundColor: [
              'rgba(65, 84, 241, 0.8)',
              'rgba(46, 202, 106, 0.8)',
              'rgba(255, 119, 29, 0.8)',
              'rgba(23, 162, 184, 0.8)',
              'rgba(220, 53, 69, 0.8)'
            ],
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  /**
   * تصدير التقرير كملف CSV
   */
  exportCSV(): void {
    if (!this.salesData) return;

    // إنشاء محتوى ملف CSV
    let csvContent = 'التاريخ,المبيعات,الطلبات\n';

    // إضافة بيانات المبيعات
    this.salesData.timeline.forEach(item => {
      csvContent += `${item.date},${item.sales},${item.orders}\n`;
    });

    // إنشاء رابط تنزيل
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `تقرير_المبيعات_${this.startDate}_${this.endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * تصدير التقرير كملف PDF
   */
  exportPDF(): void {
    // سيتم تنفيذه لاحقاً باستخدام مكتبة مناسبة
    this.toastr.info('سيتم تنفيذ هذه الميزة قريباً');
  }

  /**
   * طباعة التقرير
   */
  printReport(): void {
    window.print();
  }

  /**
   * الحصول على لون المنتج حسب الترتيب
   */
  getProductColor(index: number): string {
    const colors = ['primary', 'success', 'warning', 'info', 'danger'];
    return colors[index % colors.length];
  }
}
