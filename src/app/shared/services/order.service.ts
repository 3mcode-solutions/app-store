import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, catchError, tap } from 'rxjs/operators';
import { Order, OrderStatus, PaymentMethod, PaymentStatus } from '../interfaces/order.interface';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [
    {
      id: 1,
      orderNumber: 'ORD-2023-0001',
      userId: 1,
      userName: 'أحمد محمد',
      userEmail: 'ahmed@example.com',
      userPhone: '+966500000001',
      status: OrderStatus.Delivered,
      totalAmount: 1299.99,
      paymentMethod: PaymentMethod.CreditCard,
      paymentStatus: PaymentStatus.Paid,
      customer: {
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '+966500000001'
      },
      orderDate: '2023-10-15T10:30:00',
      shippingAddress: {
        fullName: 'أحمد محمد',
        street: 'شارع الملك فهد',
        city: 'الرياض',
        state: 'الرياض',
        postalCode: '12345',
        country: 'المملكة العربية السعودية',
        phone: '+966500000001'
      },
      items: [
        {
          id: 1,
          productId: 1,
          productName: 'هاتف سامسونج جالكسي S23',
          productImage: 'assets/img/products/phone-1.jpg',
          quantity: 1,
          price: 3499.99,
          discount: 10,
          total: 3149.99
        }
      ],
      createdAt: new Date('2023-10-15T10:30:00'),
      updatedAt: new Date('2023-10-18T14:20:00'),
      notes: 'تم التسليم بنجاح'
    },
    {
      id: 2,
      orderNumber: 'ORD-2023-0002',
      userId: 2,
      userName: 'سارة أحمد',
      userEmail: 'sara@example.com',
      userPhone: '+966500000002',
      status: OrderStatus.Processing,
      totalAmount: 899.99,
      paymentMethod: PaymentMethod.PayPal,
      paymentStatus: PaymentStatus.Paid,
      customer: {
        name: 'سارة أحمد',
        email: 'sara@example.com',
        phone: '+966500000002'
      },
      orderDate: '2023-10-20T15:45:00',
      shippingAddress: {
        fullName: 'سارة أحمد',
        street: 'شارع التحلية',
        city: 'جدة',
        state: 'مكة المكرمة',
        postalCode: '23456',
        country: 'المملكة العربية السعودية',
        phone: '+966500000002'
      },
      items: [
        {
          id: 2,
          productId: 3,
          productName: 'سماعات آبل إيربودز برو',
          productImage: 'assets/img/products/airpods.jpg',
          quantity: 1,
          price: 899.99,
          discount: 0,
          total: 899.99
        }
      ],
      createdAt: new Date('2023-10-20T15:45:00'),
      updatedAt: new Date('2023-10-21T09:10:00')
    },
    {
      id: 3,
      orderNumber: 'ORD-2023-0003',
      userId: 3,
      userName: 'محمد علي',
      userEmail: 'mohamed@example.com',
      userPhone: '+966500000003',
      status: OrderStatus.Shipped,
      totalAmount: 4999.99,
      paymentMethod: PaymentMethod.BankTransfer,
      paymentStatus: PaymentStatus.Paid,
      customer: {
        name: 'محمد علي',
        email: 'mohamed@example.com',
        phone: '+966500000003'
      },
      orderDate: '2023-10-22T11:20:00',
      trackingNumber: 'TRK123456789',
      shippingCompany: 'أرامكس',
      shippingAddress: {
        fullName: 'محمد علي',
        street: 'شارع الأمير سلطان',
        city: 'الدمام',
        state: 'المنطقة الشرقية',
        postalCode: '34567',
        country: 'المملكة العربية السعودية',
        phone: '+966500000003'
      },
      items: [
        {
          id: 3,
          productId: 2,
          productName: 'لابتوب ماك بوك برو',
          productImage: 'assets/img/products/laptop-1.jpg',
          quantity: 1,
          price: 4999.99,
          discount: 0,
          total: 4999.99
        }
      ],
      createdAt: new Date('2023-10-22T11:20:00'),
      updatedAt: new Date('2023-10-23T16:30:00')
    },
    {
      id: 4,
      orderNumber: 'ORD-2023-0004',
      userId: 4,
      userName: 'فاطمة محمد',
      userEmail: 'fatima@example.com',
      userPhone: '+966500000004',
      status: OrderStatus.Pending,
      totalAmount: 599.98,
      paymentMethod: PaymentMethod.CashOnDelivery,
      paymentStatus: PaymentStatus.Pending,
      customer: {
        name: 'فاطمة محمد',
        email: 'fatima@example.com',
        phone: '+966500000004'
      },
      orderDate: '2023-10-25T09:15:00',
      shippingAddress: {
        fullName: 'فاطمة محمد',
        street: 'شارع الملك عبدالله',
        city: 'المدينة المنورة',
        state: 'المدينة المنورة',
        postalCode: '45678',
        country: 'المملكة العربية السعودية',
        phone: '+966500000004'
      },
      items: [
        {
          id: 4,
          productId: 4,
          productName: 'قميص رجالي كلاسيك',
          productImage: 'assets/img/products/shirt-1.jpg',
          quantity: 3,
          price: 199.99,
          discount: 0,
          total: 599.97
        }
      ],
      createdAt: new Date('2023-10-25T09:15:00')
    },
    {
      id: 5,
      orderNumber: 'ORD-2023-0005',
      userId: 5,
      userName: 'خالد عبدالله',
      userEmail: 'khaled@example.com',
      userPhone: '+966500000005',
      status: OrderStatus.Cancelled,
      totalAmount: 2999.99,
      paymentMethod: PaymentMethod.CreditCard,
      paymentStatus: PaymentStatus.Refunded,
      customer: {
        name: 'خالد عبدالله',
        email: 'khaled@example.com',
        phone: '+966500000005'
      },
      orderDate: '2023-10-18T14:30:00',
      shippingAddress: {
        fullName: 'خالد عبدالله',
        street: 'شارع العليا',
        city: 'الرياض',
        state: 'الرياض',
        postalCode: '12345',
        country: 'المملكة العربية السعودية',
        phone: '+966500000005'
      },
      items: [
        {
          id: 5,
          productId: 6,
          productName: 'أريكة جلدية ثلاثية',
          productImage: 'assets/img/products/sofa-1.jpg',
          quantity: 1,
          price: 2999.99,
          discount: 0,
          total: 2999.99
        }
      ],
      createdAt: new Date('2023-10-18T14:30:00'),
      updatedAt: new Date('2023-10-19T10:45:00'),
      notes: 'تم إلغاء الطلب بناءً على طلب العميل'
    },
    {
      id: 6,
      orderNumber: 'ORD-2023-0006',
      userId: 1,
      userName: 'أحمد محمد',
      userEmail: 'ahmed@example.com',
      userPhone: '+966500000001',
      status: OrderStatus.Delivered,
      totalAmount: 1499.99,
      paymentMethod: PaymentMethod.DebitCard,
      paymentStatus: PaymentStatus.Paid,
      customer: {
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '+966500000001'
      },
      orderDate: '2023-09-30T11:20:00',
      shippingAddress: {
        fullName: 'أحمد محمد',
        street: 'شارع الملك فهد',
        city: 'الرياض',
        state: 'الرياض',
        postalCode: '12345',
        country: 'المملكة العربية السعودية',
        phone: '+966500000001'
      },
      items: [
        {
          id: 6,
          productId: 7,
          productName: 'طاولة طعام خشبية',
          productImage: 'assets/img/products/table-1.jpg',
          quantity: 1,
          price: 1499.99,
          discount: 0,
          total: 1499.99
        }
      ],
      createdAt: new Date('2023-09-30T11:20:00'),
      updatedAt: new Date('2023-10-05T15:40:00')
    },
    {
      id: 7,
      orderNumber: 'ORD-2023-0007',
      userId: 3,
      userName: 'محمد علي',
      userEmail: 'mohamed@example.com',
      userPhone: '+966500000003',
      status: OrderStatus.Returned,
      totalAmount: 3999.99,
      paymentMethod: PaymentMethod.CreditCard,
      paymentStatus: PaymentStatus.Refunded,
      customer: {
        name: 'محمد علي',
        email: 'mohamed@example.com',
        phone: '+966500000003'
      },
      orderDate: '2023-10-10T09:30:00',
      shippingAddress: {
        fullName: 'محمد علي',
        street: 'شارع الأمير سلطان',
        city: 'الدمام',
        state: 'المنطقة الشرقية',
        postalCode: '34567',
        country: 'المملكة العربية السعودية',
        phone: '+966500000003'
      },
      items: [
        {
          id: 7,
          productId: 8,
          productName: 'جهاز مشي كهربائي',
          productImage: 'assets/img/products/treadmill-1.jpg',
          quantity: 1,
          price: 3999.99,
          discount: 0,
          total: 3999.99
        }
      ],
      createdAt: new Date('2023-10-10T09:30:00'),
      updatedAt: new Date('2023-10-20T14:15:00'),
      notes: 'تم إرجاع المنتج بسبب عيب مصنعي'
    }
  ];

  constructor(private apiService: ApiService) { }

  /**
   * الحصول على جميع الطلبات
   */
  getOrders(): Observable<Order[]> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      return of([...this.orders]).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.get<Order[]>('orders').pipe(
      catchError(error => {
        console.error('Error fetching orders:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        return of([...this.orders]);
      })
    );
  }

  /**
   * الحصول على طلب بواسطة المعرف
   */
  getOrderById(id: number): Observable<Order | undefined> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const order = this.orders.find(o => o.id === id);
      return of(order).pipe(delay(300));
    }

    // استخدام API حقيقي
    return this.apiService.get<Order>(`orders/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching order with id ${id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const order = this.orders.find(o => o.id === id);
        return of(order);
      })
    );
  }

  /**
   * الحصول على طلبات المستخدم
   */
  getOrdersByUserId(userId: number): Observable<Order[]> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const userOrders = this.orders.filter(o => o.userId === userId);
      return of(userOrders).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.get<Order[]>(`users/${userId}/orders`).pipe(
      catchError(error => {
        console.error(`Error fetching orders for user ${userId}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const userOrders = this.orders.filter(o => o.userId === userId);
        return of(userOrders);
      })
    );
  }

  /**
   * إضافة طلب جديد
   */
  addOrder(order: Order): Observable<Order> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      // إنشاء معرف جديد
      const newId = Math.max(...this.orders.map(o => o.id)) + 1;

      // إنشاء رقم طلب جديد
      const year = new Date().getFullYear();
      const orderNumber = `ORD-${year}-${String(newId).padStart(4, '0')}`;

      const newOrder = {
        ...order,
        id: newId,
        orderNumber,
        createdAt: new Date()
      };

      // إضافة الطلب إلى المصفوفة
      this.orders.push(newOrder);

      return of(newOrder).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.post<Order>('orders', order).pipe(
      tap(newOrder => {
        // إضافة الطلب الجديد إلى الذاكرة المؤقتة
        this.orders.push(newOrder);
      }),
      catchError(error => {
        console.error('Error adding order:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const newId = Math.max(...this.orders.map(o => o.id)) + 1;
        const year = new Date().getFullYear();
        const orderNumber = `ORD-${year}-${String(newId).padStart(4, '0')}`;

        const newOrder = {
          ...order,
          id: newId,
          orderNumber,
          createdAt: new Date()
        };

        this.orders.push(newOrder);
        return of(newOrder);
      })
    );
  }

  /**
   * تحديث طلب موجود
   */
  updateOrder(order: Order): Observable<Order> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      // البحث عن الطلب وتحديثه
      const index = this.orders.findIndex(o => o.id === order.id);

      if (index !== -1) {
        this.orders[index] = {
          ...order,
          updatedAt: new Date()
        };
        return of(this.orders[index]).pipe(delay(500));
      }

      // إذا لم يتم العثور على الطلب
      return of(order).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.put<Order>(`orders/${order.id}`, order).pipe(
      tap(updatedOrder => {
        // تحديث الطلب في الذاكرة المؤقتة
        const index = this.orders.findIndex(o => o.id === updatedOrder.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
      }),
      catchError(error => {
        console.error(`Error updating order with id ${order.id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const index = this.orders.findIndex(o => o.id === order.id);
        if (index !== -1) {
          this.orders[index] = {
            ...order,
            updatedAt: new Date()
          };
          return of(this.orders[index]);
        }
        return of(order);
      })
    );
  }

  /**
   * تحديث حالة الطلب
   */
  updateOrderStatus(id: number, status: OrderStatus): Observable<Order | undefined> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const order = this.orders.find(o => o.id === id);

      if (order) {
        order.status = status;
        order.updatedAt = new Date();
        return of(order).pipe(delay(300));
      }

      return of(undefined).pipe(delay(300));
    }

    // استخدام API حقيقي
    return this.apiService.patch<Order>(`orders/${id}/status`, { status }).pipe(
      tap(updatedOrder => {
        // تحديث الطلب في الذاكرة المؤقتة
        const index = this.orders.findIndex(o => o.id === updatedOrder.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
      }),
      catchError(error => {
        console.error(`Error updating order status with id ${id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const order = this.orders.find(o => o.id === id);
        if (order) {
          order.status = status;
          order.updatedAt = new Date();
          return of(order);
        }
        return of(undefined);
      })
    );
  }

  /**
   * تحديث حالة الدفع
   */
  updatePaymentStatus(id: number, status: PaymentStatus): Observable<Order | undefined> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const order = this.orders.find(o => o.id === id);

      if (order) {
        order.paymentStatus = status;
        order.updatedAt = new Date();
        return of(order).pipe(delay(300));
      }

      return of(undefined).pipe(delay(300));
    }

    // استخدام API حقيقي
    return this.apiService.patch<Order>(`orders/${id}/payment-status`, { status }).pipe(
      tap(updatedOrder => {
        // تحديث الطلب في الذاكرة المؤقتة
        const index = this.orders.findIndex(o => o.id === updatedOrder.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
      }),
      catchError(error => {
        console.error(`Error updating payment status for order with id ${id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const order = this.orders.find(o => o.id === id);
        if (order) {
          order.paymentStatus = status;
          order.updatedAt = new Date();
          return of(order);
        }
        return of(undefined);
      })
    );
  }

  /**
   * حذف طلب
   */
  deleteOrder(id: number): Observable<boolean> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const initialLength = this.orders.length;
      this.orders = this.orders.filter(o => o.id !== id);

      // التحقق من نجاح الحذف
      const success = initialLength > this.orders.length;

      return of(success).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.delete<any>(`orders/${id}`).pipe(
      map(() => {
        // حذف الطلب من الذاكرة المؤقتة
        const initialLength = this.orders.length;
        this.orders = this.orders.filter(o => o.id !== id);
        return initialLength > this.orders.length;
      }),
      catchError(error => {
        console.error(`Error deleting order with id ${id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        return of(false);
      })
    );
  }

  /**
   * الحصول على إحصائيات الطلبات
   */
  getOrderStats(): Observable<any> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const totalOrders = this.orders.length;
      const pendingOrders = this.orders.filter(o => o.status === OrderStatus.Pending).length;
      const processingOrders = this.orders.filter(o => o.status === OrderStatus.Processing).length;
      const shippedOrders = this.orders.filter(o => o.status === OrderStatus.Shipped).length;
      const deliveredOrders = this.orders.filter(o => o.status === OrderStatus.Delivered).length;
      const cancelledOrders = this.orders.filter(o => o.status === OrderStatus.Cancelled).length;
      const returnedOrders = this.orders.filter(o => o.status === OrderStatus.Returned).length;

      const totalRevenue = this.orders
        .filter(o => o.paymentStatus === PaymentStatus.Paid)
        .reduce((sum, order) => sum + order.totalAmount, 0);

      const stats = {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        returnedOrders,
        totalRevenue
      };

      return of(stats).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.get<any>('orders/stats').pipe(
      catchError(error => {
        console.error('Error fetching order stats:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const totalOrders = this.orders.length;
        const pendingOrders = this.orders.filter(o => o.status === OrderStatus.Pending).length;
        const processingOrders = this.orders.filter(o => o.status === OrderStatus.Processing).length;
        const shippedOrders = this.orders.filter(o => o.status === OrderStatus.Shipped).length;
        const deliveredOrders = this.orders.filter(o => o.status === OrderStatus.Delivered).length;
        const cancelledOrders = this.orders.filter(o => o.status === OrderStatus.Cancelled).length;
        const returnedOrders = this.orders.filter(o => o.status === OrderStatus.Returned).length;

        const totalRevenue = this.orders
          .filter(o => o.paymentStatus === PaymentStatus.Paid)
          .reduce((sum, order) => sum + order.totalAmount, 0);

        return of({
          totalOrders,
          pendingOrders,
          processingOrders,
          shippedOrders,
          deliveredOrders,
          cancelledOrders,
          returnedOrders,
          totalRevenue
        });
      })
    );
  }

  /**
   * الحصول على الطلبات حسب الحالة
   */
  getOrdersByStatus(status: string): Observable<Order[]> {
    // تحويل النص إلى حالة الطلب المناسبة
    let orderStatus: OrderStatus;

    switch (status.toLowerCase()) {
      case 'pending':
        orderStatus = OrderStatus.Pending;
        break;
      case 'processing':
        orderStatus = OrderStatus.Processing;
        break;
      case 'shipping':
      case 'shipped':
        orderStatus = OrderStatus.Shipped;
        break;
      case 'delivered':
        orderStatus = OrderStatus.Delivered;
        break;
      case 'cancelled':
        orderStatus = OrderStatus.Cancelled;
        break;
      case 'returned':
        orderStatus = OrderStatus.Returned;
        break;
      default:
        orderStatus = OrderStatus.Pending;
    }

    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      // فلترة الطلبات حسب الحالة
      const filteredOrders = this.orders.filter(order => order.status === orderStatus);
      return of(filteredOrders).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.get<Order[]>(`orders/status/${status}`).pipe(
      catchError(error => {
        console.error(`Error fetching orders with status ${status}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const filteredOrders = this.orders.filter(order => order.status === orderStatus);
        return of(filteredOrders);
      })
    );
  }
}
