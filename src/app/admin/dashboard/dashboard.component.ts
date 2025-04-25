import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var ApexCharts: any;
declare var Chart: any;

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // إتاحة كائن Math للقالب
  Math = Math;

  // بيانات الإحصائيات
  salesStats = {
    today: 145,
    growth: 12,
    isPositive: true
  };

  revenueStats = {
    amount: 3264,
    growth: 8,
    isPositive: true
  };

  customersStats = {
    count: 1244,
    growth: -12,
    isPositive: false
  };

  // بيانات المبيعات الأخيرة
  recentSales = [
    { id: 2457, customer: 'محمد أحمد', product: 'هاتف ذكي', price: 1200, status: 'تم التسليم', statusClass: 'success' },
    { id: 2147, customer: 'سارة محمد', product: 'لابتوب', price: 3500, status: 'قيد المعالجة', statusClass: 'warning' },
    { id: 2049, customer: 'أحمد علي', product: 'سماعات لاسلكية', price: 350, status: 'تم التسليم', statusClass: 'success' },
    { id: 2644, customer: 'نورة خالد', product: 'ساعة ذكية', price: 800, status: 'ملغي', statusClass: 'danger' },
    { id: 2645, customer: 'خالد عبدالله', product: 'جهاز تابلت', price: 1500, status: 'تم التسليم', statusClass: 'success' }
  ];

  // بيانات المنتجات الأكثر مبيعاً
  topSellingProducts = [
    { image: 'assets/admin/img/product-1.jpg', name: 'هاتف ذكي', price: 1200, sales: 124, revenue: 148800 },
    { image: 'assets/admin/img/product-2.jpg', name: 'لابتوب', price: 3500, sales: 98, revenue: 343000 },
    { image: 'assets/admin/img/product-3.jpg', name: 'سماعات لاسلكية', price: 350, sales: 74, revenue: 25900 },
    { image: 'assets/admin/img/product-4.jpg', name: 'ساعة ذكية', price: 800, sales: 63, revenue: 50400 },
    { image: 'assets/admin/img/product-5.jpg', name: 'جهاز تابلت', price: 1500, sales: 41, revenue: 61500 }
  ];

  // بيانات النشاط الأخير
  recentActivities = [
    { time: '32 دقيقة', type: 'success', content: 'تم إضافة منتج جديد <a href="#" class="fw-bold text-dark">هاتف ذكي</a>' },
    { time: '56 دقيقة', type: 'danger', content: 'تم إلغاء طلب #2457' },
    { time: '2 ساعة', type: 'primary', content: 'تم تحديث معلومات المنتج "لابتوب"' },
    { time: '1 يوم', type: 'info', content: 'تم تسجيل مستخدم جديد <a href="#" class="fw-bold text-dark">أحمد محمد</a>' },
    { time: '2 يوم', type: 'warning', content: 'تم تحديث إعدادات المتجر' },
    { time: '4 أسابيع', type: 'muted', content: 'تم إطلاق النسخة الجديدة من المتجر' }
  ];

  // بيانات الأخبار والتحديثات
  newsUpdates = [
    { image: 'assets/admin/img/news-1.jpg', title: 'عروض جديدة على المنتجات الإلكترونية', content: 'استفد من العروض الجديدة على جميع المنتجات الإلكترونية...' },
    { image: 'assets/admin/img/news-2.jpg', title: 'تحديث سياسة الشحن', content: 'تم تحديث سياسة الشحن لتشمل مناطق جديدة وأسعار مخفضة...' },
    { image: 'assets/admin/img/news-3.jpg', title: 'منتجات جديدة قادمة قريباً', content: 'ترقبوا وصول أحدث المنتجات إلى متجرنا خلال الأسبوع القادم...' },
    { image: 'assets/admin/img/news-4.jpg', title: 'تحديث نظام المتجر', content: 'تم تحديث نظام المتجر لتحسين تجربة المستخدم وسرعة التصفح...' }
  ];

  constructor() { }

  ngOnInit(): void {
    // تهيئة المكون عند التحميل
  }

  ngAfterViewInit(): void {
    // تهيئة الرسوم البيانية بعد تحميل العرض
    this.initSalesChart();
    this.initRevenueChart();
    this.initCustomersChart();
  }

  /**
   * تهيئة رسم بياني للمبيعات
   */
  private initSalesChart(): void {
    if (typeof ApexCharts !== 'undefined') {
      const salesChartElement = document.querySelector("#salesChart");
      if (salesChartElement) {
        const salesChart = new ApexCharts(salesChartElement, {
          series: [{
            name: 'المبيعات',
            data: [31, 40, 28, 51, 42, 82, 56, 45, 53, 59, 70, 91]
          }],
          chart: {
            height: 350,
            type: 'area',
            toolbar: {
              show: false
            },
          },
          markers: {
            size: 4
          },
          colors: ['#4154f1'],
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.3,
              opacityTo: 0.4,
              stops: [0, 90, 100]
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth',
            width: 2
          },
          xaxis: {
            categories: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
          },
          tooltip: {
            x: {
              format: 'dd/MM/yy HH:mm'
            },
          }
        });
        salesChart.render();
      }
    }
  }

  /**
   * تهيئة رسم بياني للإيرادات
   */
  private initRevenueChart(): void {
    if (typeof ApexCharts !== 'undefined') {
      const revenueChartElement = document.querySelector("#revenueChart");
      if (revenueChartElement) {
        const revenueChart = new ApexCharts(revenueChartElement, {
          series: [{
            name: 'الإيرادات',
            data: [11000, 14000, 9000, 21000, 15000, 25000, 18000, 17000, 23000, 19000, 24000, 28000]
          }],
          chart: {
            height: 350,
            type: 'bar',
            toolbar: {
              show: false
            },
          },
          colors: ['#2eca6a'],
          fill: {
            opacity: 1
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
          },
          tooltip: {
            y: {
              formatter: function(val: number) {
                return val + " ريال";
              }
            }
          }
        });
        revenueChart.render();
      }
    }
  }

  /**
   * تهيئة رسم بياني للعملاء
   */
  private initCustomersChart(): void {
    if (typeof Chart !== 'undefined') {
      const customersChartElement = document.getElementById('customersChart');
      if (customersChartElement) {
        const customersChart = new Chart(customersChartElement, {
          type: 'pie',
          data: {
            labels: [
              'عملاء جدد',
              'عملاء حاليين',
              'عملاء غير نشطين'
            ],
            datasets: [{
              data: [300, 850, 94],
              backgroundColor: [
                '#4154f1',
                '#2eca6a',
                '#ff771d'
              ],
              hoverOffset: 4
            }]
          },
          options: {
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      }
    }
  }
}
