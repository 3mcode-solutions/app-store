import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Order, OrderStatus, PaymentMethod, PaymentStatus } from '../../shared/interfaces/order.interface';
import { OrderService } from '../../shared/services/order.service';
import { ProductService } from '../../shared/services/product.service';
import { ToastrService } from '../../shared/services/toastr.service';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  // بيانات الطلبات
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;

  // إحصائيات الطلبات
  orderStats: any = {
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    returnedOrders: 0,
    totalRevenue: 0
  };

  // نموذج تحديث الحالة
  statusForm: FormGroup;

  // فلترة وترتيب
  searchTerm = '';
  statusFilter = '';
  sortBy = 'date_desc';

  // ترقيم الصفحات
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // النوافذ المنبثقة
  orderDetailsModal: any;
  updateStatusModal: any;
  deleteModal: any;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private productService: ProductService,
    private toastr: ToastrService
  ) {
    // إنشاء نموذج تحديث الحالة
    this.statusForm = this.fb.group({
      orderStatus: [''],
      paymentStatus: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    // تحميل البيانات
    this.loadOrders();
    this.loadOrderStats();

    // تهيئة النوافذ المنبثقة
    this.initModals();
  }

  /**
   * تحميل الطلبات
   */
  loadOrders(): void {
    this.orderService.getOrders().subscribe(
      (orders) => {
        this.orders = orders;
        this.applyFilter();
      },
      (error) => {
        console.error('Error loading orders:', error);
        this.toastr.error('حدث خطأ أثناء تحميل الطلبات');
      }
    );
  }

  /**
   * تحميل إحصائيات الطلبات
   */
  loadOrderStats(): void {
    this.orderService.getOrderStats().subscribe(
      (stats) => {
        this.orderStats = stats;
      },
      (error) => {
        console.error('Error loading order stats:', error);
      }
    );
  }

  /**
   * تهيئة النوافذ المنبثقة
   */
  initModals(): void {
    setTimeout(() => {
      this.orderDetailsModal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
      this.updateStatusModal = new bootstrap.Modal(document.getElementById('updateStatusModal'));
      this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    }, 500);
  }

  /**
   * تطبيق الفلترة والترتيب
   */
  applyFilter(): void {
    // تطبيق الفلترة
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchTerm ||
        order.orderNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.userEmail.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.statusFilter || order.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    // تطبيق الترتيب
    this.sortOrders();

    // حساب عدد الصفحات
    this.calculatePagination();
  }

  /**
   * تصفية الطلبات حسب الحالة
   */
  filterOrders(status: string): void {
    if (status === 'all') {
      this.statusFilter = '';
    } else {
      this.statusFilter = status as OrderStatus;
    }
    this.applyFilter();
  }

  /**
   * ترتيب الطلبات
   */
  sortOrders(): void {
    switch (this.sortBy) {
      case 'date_asc':
        this.filteredOrders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'date_desc':
        this.filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'amount_asc':
        this.filteredOrders.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      case 'amount_desc':
        this.filteredOrders.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      default:
        this.filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
  }

  /**
   * حساب ترقيم الصفحات
   */
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.pageSize);

    // تعديل الصفحة الحالية إذا كانت خارج النطاق
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }

    // تطبيق ترقيم الصفحات
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredOrders = this.filteredOrders.slice(startIndex, startIndex + this.pageSize);
  }

  /**
   * الحصول على أرقام الصفحات للعرض
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  /**
   * تغيير الصفحة الحالية
   */
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilter();
    }
  }

  /**
   * الحصول على اسم حالة الطلب
   */
  getOrderStatusName(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.Pending:
        return 'قيد الانتظار';
      case OrderStatus.Processing:
        return 'قيد المعالجة';
      case OrderStatus.Shipped:
        return 'تم الشحن';
      case OrderStatus.Delivered:
        return 'تم التسليم';
      case OrderStatus.Cancelled:
        return 'ملغي';
      case OrderStatus.Returned:
        return 'مرتجع';
      default:
        return 'غير معروف';
    }
  }

  /**
   * الحصول على صنف CSS لحالة الطلب
   */
  getOrderStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.Pending:
        return 'badge bg-warning';
      case OrderStatus.Processing:
        return 'badge bg-info';
      case OrderStatus.Shipped:
        return 'badge bg-primary';
      case OrderStatus.Delivered:
        return 'badge bg-success';
      case OrderStatus.Cancelled:
        return 'badge bg-danger';
      case OrderStatus.Returned:
        return 'badge bg-secondary';
      default:
        return 'badge bg-light';
    }
  }

  /**
   * الحصول على اسم طريقة الدفع
   */
  getPaymentMethodName(method: PaymentMethod): string {
    switch (method) {
      case PaymentMethod.CreditCard:
        return 'بطاقة ائتمان';
      case PaymentMethod.DebitCard:
        return 'بطاقة خصم';
      case PaymentMethod.PayPal:
        return 'باي بال';
      case PaymentMethod.BankTransfer:
        return 'تحويل بنكي';
      case PaymentMethod.CashOnDelivery:
        return 'الدفع عند الاستلام';
      default:
        return 'غير معروف';
    }
  }

  /**
   * الحصول على اسم حالة الدفع
   */
  getPaymentStatusName(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.Pending:
        return 'قيد الانتظار';
      case PaymentStatus.Paid:
        return 'تم الدفع';
      case PaymentStatus.Failed:
        return 'فشل الدفع';
      case PaymentStatus.Refunded:
        return 'تم الاسترجاع';
      default:
        return 'غير معروف';
    }
  }

  /**
   * الحصول على صنف CSS لحالة الدفع
   */
  getPaymentStatusClass(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.Pending:
        return 'badge bg-warning';
      case PaymentStatus.Paid:
        return 'badge bg-success';
      case PaymentStatus.Failed:
        return 'badge bg-danger';
      case PaymentStatus.Refunded:
        return 'badge bg-info';
      default:
        return 'badge bg-light';
    }
  }

  /**
   * عرض تفاصيل الطلب
   */
  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.orderDetailsModal.show();
  }

  /**
   * فتح نافذة تحديث حالة الطلب
   */
  updateOrderStatus(order: Order): void {
    this.selectedOrder = order;

    this.statusForm.patchValue({
      orderStatus: order.status,
      paymentStatus: order.paymentStatus,
      notes: order.notes || ''
    });

    this.updateStatusModal.show();
  }

  /**
   * تأكيد تحديث حالة الطلب
   */
  confirmUpdateStatus(): void {
    if (!this.selectedOrder) return;

    const formValues = this.statusForm.value;

    // تحديث حالة الطلب
    this.orderService.updateOrderStatus(this.selectedOrder.id, formValues.orderStatus).subscribe(
      () => {
        // تحديث حالة الدفع
        this.orderService.updatePaymentStatus(this.selectedOrder!.id, formValues.paymentStatus).subscribe(
          (updatedOrder) => {
            if (updatedOrder) {
              // تحديث الملاحظات
              updatedOrder.notes = formValues.notes;
              this.orderService.updateOrder(updatedOrder).subscribe(
                () => {
                  this.toastr.success('تم تحديث حالة الطلب بنجاح');
                  this.loadOrders();
                  this.loadOrderStats();
                  this.updateStatusModal.hide();
                },
                (error) => {
                  console.error('Error updating order notes:', error);
                  this.toastr.error('حدث خطأ أثناء تحديث ملاحظات الطلب');
                }
              );
            }
          },
          (error) => {
            console.error('Error updating payment status:', error);
            this.toastr.error('حدث خطأ أثناء تحديث حالة الدفع');
          }
        );
      },
      (error) => {
        console.error('Error updating order status:', error);
        this.toastr.error('حدث خطأ أثناء تحديث حالة الطلب');
      }
    );
  }

  /**
   * فتح نافذة حذف طلب
   */
  deleteOrder(order: Order): void {
    this.selectedOrder = order;
    this.deleteModal.show();
  }

  /**
   * تأكيد حذف الطلب
   */
  confirmDelete(): void {
    if (!this.selectedOrder) return;

    this.orderService.deleteOrder(this.selectedOrder.id).subscribe(
      (success) => {
        if (success) {
          this.toastr.success('تم حذف الطلب بنجاح');
          this.loadOrders();
          this.loadOrderStats();
          this.deleteModal.hide();
        } else {
          this.toastr.error('حدث خطأ أثناء حذف الطلب');
        }
      },
      (error) => {
        console.error('Error deleting order:', error);
        this.toastr.error('حدث خطأ أثناء حذف الطلب');
      }
    );
  }
}
