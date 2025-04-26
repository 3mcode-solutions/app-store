import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Customer } from '../../shared/models/customer.model';
import { CustomerService } from '../../shared/services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  // قائمة العملاء
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];

  // العميل المحدد للعرض
  selectedCustomer: Customer | null = null;

  // إحصائيات
  totalCustomers: number = 0;
  totalOrders: number = 0;
  totalRevenue: number = 0;

  // فلاتر
  filterOptions = {
    status: '',
    group: '',
    search: ''
  };

  // حالة التحميل
  isLoading: boolean = true;

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  /**
   * تحميل بيانات العملاء
   */
  loadCustomers(): void {
    this.isLoading = true;

    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
      this.calculateStatistics();
      this.applyFilters();
      this.isLoading = false;
    });
  }

  /**
   * حساب الإحصائيات
   */
  calculateStatistics(): void {
    this.totalCustomers = this.customers.length;
    this.totalOrders = this.customers.reduce((sum, customer) => sum + customer.totalOrders, 0);
    this.totalRevenue = this.customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  }

  /**
   * تطبيق الفلاتر على العملاء
   */
  applyFilters(): void {
    let filtered = this.customers;

    // فلترة حسب الحالة
    if (this.filterOptions.status) {
      filtered = filtered.filter(c => c.status === this.filterOptions.status);
    }

    // فلترة حسب المجموعة
    if (this.filterOptions.group) {
      filtered = filtered.filter(c => c.groupName === this.filterOptions.group);
    }

    // فلترة حسب البحث
    if (this.filterOptions.search) {
      const searchTerm = this.filterOptions.search.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm) ||
        c.phone.includes(searchTerm) ||
        (c.address && c.address.toLowerCase().includes(searchTerm))
      );
    }

    this.filteredCustomers = filtered;
  }

  /**
   * عرض تفاصيل العميل
   */
  viewCustomerDetails(customer: Customer): void {
    this.selectedCustomer = customer;
  }

  /**
   * إغلاق تفاصيل العميل
   */
  closeCustomerDetails(): void {
    this.selectedCustomer = null;
  }

  /**
   * تغيير حالة العميل
   */
  toggleCustomerStatus(customer: Customer): void {
    const newStatus = customer.status === 'active' ? 'inactive' : 'active';

    this.customerService.toggleCustomerStatus(customer.id, newStatus).subscribe(updatedCustomer => {
      if (updatedCustomer) {
        // تحديث العميل في القائمة
        const index = this.customers.findIndex(c => c.id === customer.id);
        if (index !== -1) {
          this.customers[index] = updatedCustomer;
        }

        // تحديث العميل المحدد إذا كان هو نفسه
        if (this.selectedCustomer && this.selectedCustomer.id === customer.id) {
          this.selectedCustomer = updatedCustomer;
        }

        this.applyFilters();
      }
    });
  }

  /**
   * حظر العميل
   */
  blockCustomer(customer: Customer): void {
    if (confirm(`هل أنت متأكد من رغبتك في حظر العميل "${customer.name}"؟`)) {
      this.customerService.toggleCustomerStatus(customer.id, 'blocked').subscribe(updatedCustomer => {
        if (updatedCustomer) {
          // تحديث العميل في القائمة
          const index = this.customers.findIndex(c => c.id === customer.id);
          if (index !== -1) {
            this.customers[index] = updatedCustomer;
          }

          // تحديث العميل المحدد إذا كان هو نفسه
          if (this.selectedCustomer && this.selectedCustomer.id === customer.id) {
            this.selectedCustomer = updatedCustomer;
          }

          this.applyFilters();
        }
      });
    }
  }

  /**
   * حذف العميل
   */
  deleteCustomer(customer: Customer): void {
    if (confirm(`هل أنت متأكد من رغبتك في حذف العميل "${customer.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
      this.customerService.deleteCustomer(customer.id).subscribe(success => {
        if (success) {
          // إغلاق تفاصيل العميل إذا كان هو المحدد
          if (this.selectedCustomer && this.selectedCustomer.id === customer.id) {
            this.closeCustomerDetails();
          }

          // إعادة تحميل العملاء
          this.loadCustomers();
        }
      });
    }
  }

  /**
   * تنسيق التاريخ
   */
  formatDate(date: Date | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ar-EG');
  }

  /**
   * الحصول على قائمة المجموعات الفريدة
   */
  getUniqueGroups(): string[] {
    const groups = this.customers
      .filter(c => c.groupName)
      .map(c => c.groupName as string);

    return [...new Set(groups)];
  }

  /**
   * الحصول على لون حالة العميل
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'blocked': return 'danger';
      default: return 'secondary';
    }
  }

  /**
   * الحصول على نص حالة العميل
   */
  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'blocked': return 'محظور';
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
      status: '',
      group: '',
      search: ''
    };
    this.applyFilters();
  }
}
