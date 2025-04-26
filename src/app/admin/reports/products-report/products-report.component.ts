import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProductReport {
  id: number;
  name: string;
  category: string;
  totalSales: number;
  revenue: number;
  stock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

@Component({
  selector: 'app-products-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-report.component.html',
  styleUrls: ['./products-report.component.css']
})
export class ProductsReportComponent implements OnInit {
  products: ProductReport[] = [
    {
      id: 1,
      name: 'هاتف ذكي سامسونج جالاكسي S21',
      category: 'الهواتف الذكية',
      totalSales: 120,
      revenue: 120000,
      stock: 45,
      status: 'in-stock'
    },
    {
      id: 2,
      name: 'لابتوب ديل XPS 13',
      category: 'أجهزة الكمبيوتر المحمولة',
      totalSales: 85,
      revenue: 170000,
      stock: 20,
      status: 'in-stock'
    },
    {
      id: 3,
      name: 'سماعات آبل AirPods Pro',
      category: 'الملحقات',
      totalSales: 200,
      revenue: 80000,
      stock: 5,
      status: 'low-stock'
    },
    {
      id: 4,
      name: 'ساعة ذكية آبل Watch Series 7',
      category: 'الساعات الذكية',
      totalSales: 95,
      revenue: 76000,
      stock: 15,
      status: 'in-stock'
    },
    {
      id: 5,
      name: 'تلفزيون سامسونج QLED 4K',
      category: 'التلفزيونات',
      totalSales: 50,
      revenue: 150000,
      stock: 0,
      status: 'out-of-stock'
    }
  ];

  // فلترة التقرير
  filterOptions = {
    category: '',
    status: '',
    sortBy: 'totalSales', // totalSales, revenue, stock
    sortOrder: 'desc' // asc, desc
  };

  // قائمة التصنيفات
  categories = [
    'الهواتف الذكية',
    'أجهزة الكمبيوتر المحمولة',
    'الملحقات',
    'الساعات الذكية',
    'التلفزيونات'
  ];

  // قائمة حالات المخزون
  statuses = [
    { value: 'in-stock', label: 'متوفر' },
    { value: 'low-stock', label: 'مخزون منخفض' },
    { value: 'out-of-stock', label: 'غير متوفر' }
  ];

  // المنتجات المفلترة
  filteredProducts: ProductReport[] = [];

  constructor() { }

  ngOnInit(): void {
    this.applyFilters();
  }

  /**
   * تطبيق الفلاتر على المنتجات
   */
  applyFilters(): void {
    // فلترة حسب التصنيف
    let filtered = this.products;
    if (this.filterOptions.category) {
      filtered = filtered.filter(p => p.category === this.filterOptions.category);
    }

    // فلترة حسب حالة المخزون
    if (this.filterOptions.status) {
      filtered = filtered.filter(p => p.status === this.filterOptions.status);
    }

    // ترتيب النتائج
    filtered.sort((a, b) => {
      const aValue = a[this.filterOptions.sortBy as keyof ProductReport];
      const bValue = b[this.filterOptions.sortBy as keyof ProductReport];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return this.filterOptions.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    this.filteredProducts = filtered;
  }

  /**
   * الحصول على لون حالة المخزون
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'in-stock': return 'success';
      case 'low-stock': return 'warning';
      case 'out-of-stock': return 'danger';
      default: return 'secondary';
    }
  }

  /**
   * الحصول على نص حالة المخزون
   */
  getStatusText(status: string): string {
    switch (status) {
      case 'in-stock': return 'متوفر';
      case 'low-stock': return 'مخزون منخفض';
      case 'out-of-stock': return 'غير متوفر';
      default: return '';
    }
  }

  /**
   * تنسيق المبلغ
   */
  formatCurrency(amount: number): string {
    return amount.toLocaleString('ar-SA') + ' ريال';
  }

  /**
   * إعادة تعيين الفلاتر
   */
  resetFilters(): void {
    this.filterOptions = {
      category: '',
      status: '',
      sortBy: 'totalSales',
      sortOrder: 'desc'
    };
    this.applyFilters();
  }

  /**
   * حساب إجمالي المبيعات
   */
  getTotalSales(): number {
    return this.filteredProducts.reduce((sum, product) => sum + product.totalSales, 0);
  }

  /**
   * حساب إجمالي الإيرادات
   */
  getTotalRevenue(): number {
    return this.filteredProducts.reduce((sum, product) => sum + product.revenue, 0);
  }
}
