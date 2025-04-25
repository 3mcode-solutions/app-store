import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { ToastrService } from '../../../shared/services/toastr.service';
import { Order, OrderStatus } from '../../../shared/interfaces/order.interface';

@Component({
  selector: 'app-shipping-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './shipping-orders.component.html',
  styleUrls: ['./shipping-orders.component.css']
})
export class ShippingOrdersComponent implements OnInit {
  // بيانات الطلبات
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;

  // فلترة وترتيب
  searchTerm = '';
  dateFilter = '';

  // ترقيم الصفحات
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // حالة التحميل
  isLoading = false;

  // بيانات الشحن
  trackingNumber = '';
  shippingCompany = '';

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadShippingOrders();
  }

  /**
   * تحميل الطلبات قيد الشحن
   */
  loadShippingOrders(): void {
    this.isLoading = true;
    this.orderService.getOrdersByStatus('shipping').subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading shipping orders:', error);
        this.toastr.error('حدث خطأ أثناء تحميل الطلبات قيد الشحن');
        this.isLoading = false;
      }
    });
  }

  /**
   * تطبيق الفلترة
   */
  applyFilter(): void {
    let filtered = [...this.orders];

    // فلترة حسب البحث
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(term) ||
        order.customer.name.toLowerCase().includes(term) ||
        order.customer.email.toLowerCase().includes(term) ||
        order.customer.phone.toLowerCase().includes(term) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(term))
      );
    }

    // فلترة حسب التاريخ
    if (this.dateFilter) {
      const filterDate = new Date(this.dateFilter);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.toDateString() === filterDate.toDateString();
      });
    }

    // تطبيق ترقيم الصفحات
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredOrders = filtered.slice(startIndex, startIndex + this.pageSize);
  }

  /**
   * تغيير الصفحة
   */
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilter();
    }
  }

  /**
   * عرض تفاصيل الطلب
   */
  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.trackingNumber = order.trackingNumber || '';
    this.shippingCompany = order.shippingCompany || '';
    // هنا يمكن فتح نافذة منبثقة لعرض التفاصيل
  }

  /**
   * تحديث حالة الطلب
   */
  updateOrderStatus(order: Order, status: string): void {
    this.isLoading = true;
    // Convertir el string a OrderStatus
    const orderStatus = this.convertToOrderStatus(status);
    const updatedOrder = { ...order, status: orderStatus };

    this.orderService.updateOrder(updatedOrder).subscribe({
      next: () => {
        this.toastr.success(`تم تحديث حالة الطلب إلى ${this.getStatusText(status)}`);
        this.loadShippingOrders();
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        this.toastr.error('حدث خطأ أثناء تحديث حالة الطلب');
        this.isLoading = false;
      }
    });
  }

  /**
   * تحديث معلومات الشحن
   */
  updateShippingInfo(): void {
    if (!this.selectedOrder) return;

    this.isLoading = true;
    // Asegurarse de que el status sea del tipo OrderStatus
    const status = this.selectedOrder.status;
    const updatedOrder = {
      ...this.selectedOrder,
      trackingNumber: this.trackingNumber,
      shippingCompany: this.shippingCompany,
      status: typeof status === 'string' ? this.convertToOrderStatus(status as string) : status
    };

    this.orderService.updateOrder(updatedOrder).subscribe({
      next: () => {
        this.toastr.success('تم تحديث معلومات الشحن بنجاح');
        this.loadShippingOrders();
        // إغلاق النافذة المنبثقة
      },
      error: (error) => {
        console.error('Error updating shipping info:', error);
        this.toastr.error('حدث خطأ أثناء تحديث معلومات الشحن');
        this.isLoading = false;
      }
    });
  }

  /**
   * الحصول على نص حالة الطلب
   */
  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'قيد المعالجة';
      case 'processing': return 'قيد التجهيز';
      case 'shipping': return 'قيد الشحن';
      case 'delivered': return 'تم التسليم';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  }

  /**
   * الحصول على نص حالة الدفع
   */
  getPaymentStatusText(status: string): string {
    switch (status) {
      case 'paid': return 'مدفوع';
      case 'pending': return 'قيد الانتظار';
      case 'failed': return 'فشل الدفع';
      default: return status;
    }
  }

  /**
   * الحصول على لون حالة الطلب
   */
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'processing': return 'bg-info';
      case 'shipping': return 'bg-primary';
      case 'delivered': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  /**
   * الحصول على لون حالة الدفع
   */
  getPaymentStatusBadgeClass(status: string): string {
    switch (status) {
      case 'paid': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'failed': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  /**
   * حساب إجمالي الطلب
   */
  calculateOrderTotal(order: Order): number {
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  /**
   * تحويل النص إلى حالة الطلب
   */
  convertToOrderStatus(status: string): OrderStatus {
    switch (status) {
      case 'pending':
        return OrderStatus.Pending;
      case 'processing':
        return OrderStatus.Processing;
      case 'shipping':
        return OrderStatus.Shipped;
      case 'delivered':
        return OrderStatus.Delivered;
      case 'cancelled':
        return OrderStatus.Cancelled;
      case 'returned':
        return OrderStatus.Returned;
      default:
        return OrderStatus.Pending;
    }
  }
}
