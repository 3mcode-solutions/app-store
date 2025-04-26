import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Customer, CustomerGroup } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  // بيانات العملاء (مؤقتة حتى يتم ربطها بـ API)
  private customers: Customer[] = [
    {
      id: 1,
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '+966 50 123 4567',
      address: 'شارع الملك فهد',
      city: 'الرياض',
      country: 'المملكة العربية السعودية',
      postalCode: '12345',
      registrationDate: new Date(2023, 0, 15),
      lastLoginDate: new Date(2023, 9, 20),
      totalOrders: 8,
      totalSpent: 4500,
      groupId: 2,
      groupName: 'عملاء VIP',
      status: 'active',
      notes: 'عميل مميز',
      avatar: 'assets/admin/img/profile-img.jpg'
    },
    {
      id: 2,
      name: 'سارة أحمد',
      email: 'sara@example.com',
      phone: '+966 55 987 6543',
      address: 'شارع الأمير محمد بن عبدالعزيز',
      city: 'جدة',
      country: 'المملكة العربية السعودية',
      postalCode: '23456',
      registrationDate: new Date(2023, 1, 20),
      lastLoginDate: new Date(2023, 9, 18),
      totalOrders: 5,
      totalSpent: 3200,
      groupId: 1,
      groupName: 'عملاء عاديون',
      status: 'active',
      avatar: 'assets/admin/img/messages-2.jpg'
    },
    {
      id: 3,
      name: 'محمد علي',
      email: 'mohamed@example.com',
      phone: '+966 54 456 7890',
      address: 'شارع الخليج',
      city: 'الدمام',
      country: 'المملكة العربية السعودية',
      registrationDate: new Date(2023, 2, 10),
      totalOrders: 3,
      totalSpent: 1800,
      groupId: 1,
      groupName: 'عملاء عاديون',
      status: 'inactive',
      notes: 'لم يكمل عملية الشراء الأخيرة',
      avatar: 'assets/admin/img/messages-3.jpg'
    },
    {
      id: 4,
      name: 'فاطمة حسن',
      email: 'fatima@example.com',
      phone: '+966 56 789 0123',
      address: 'شارع إبراهيم الخليل',
      city: 'مكة',
      country: 'المملكة العربية السعودية',
      postalCode: '34567',
      registrationDate: new Date(2023, 3, 5),
      lastLoginDate: new Date(2023, 9, 15),
      totalOrders: 6,
      totalSpent: 3800,
      groupId: 2,
      groupName: 'عملاء VIP',
      status: 'active',
      avatar: 'assets/admin/img/messages-1.jpg'
    },
    {
      id: 5,
      name: 'علي محمود',
      email: 'ali@example.com',
      phone: '+966 59 321 6547',
      address: 'شارع العزيزية',
      city: 'المدينة المنورة',
      country: 'المملكة العربية السعودية',
      registrationDate: new Date(2023, 4, 12),
      lastLoginDate: new Date(2023, 9, 10),
      totalOrders: 2,
      totalSpent: 1200,
      groupId: 1,
      groupName: 'عملاء عاديون',
      status: 'active',
      avatar: 'assets/admin/img/messages-2.jpg'
    },
    {
      id: 6,
      name: 'نورة سعيد',
      email: 'noura@example.com',
      phone: '+966 58 654 3210',
      address: 'شارع الملك عبدالله',
      city: 'الرياض',
      country: 'المملكة العربية السعودية',
      postalCode: '12345',
      registrationDate: new Date(2023, 5, 25),
      totalOrders: 0,
      totalSpent: 0,
      groupId: 1,
      groupName: 'عملاء عاديون',
      status: 'blocked',
      notes: 'تم حظر الحساب بسبب نشاط مشبوه',
      avatar: 'assets/admin/img/messages-1.jpg'
    }
  ];

  // بيانات مجموعات العملاء (مؤقتة حتى يتم ربطها بـ API)
  private customerGroups: CustomerGroup[] = [
    {
      id: 1,
      name: 'عملاء عاديون',
      description: 'العملاء الذين يشترون بشكل عادي',
      discount: 0,
      membersCount: 3,
      createdAt: new Date(2023, 0, 1),
      status: 'active'
    },
    {
      id: 2,
      name: 'عملاء VIP',
      description: 'العملاء المميزون الذين يشترون بكميات كبيرة',
      discount: 10,
      membersCount: 2,
      createdAt: new Date(2023, 0, 1),
      status: 'active'
    },
    {
      id: 3,
      name: 'عملاء بالجملة',
      description: 'العملاء الذين يشترون بالجملة',
      discount: 15,
      membersCount: 0,
      createdAt: new Date(2023, 0, 1),
      status: 'active'
    },
    {
      id: 4,
      name: 'موظفون',
      description: 'موظفو الشركة',
      discount: 20,
      membersCount: 0,
      createdAt: new Date(2023, 0, 1),
      status: 'inactive'
    }
  ];

  // BehaviorSubjects للاشتراك في تغييرات البيانات
  private customersSubject = new BehaviorSubject<Customer[]>(this.customers);
  private customerGroupsSubject = new BehaviorSubject<CustomerGroup[]>(this.customerGroups);

  constructor() {
    // تحديث عدد الأعضاء في كل مجموعة
    this.updateGroupMembersCounts();
  }

  /**
   * الحصول على جميع العملاء
   */
  getCustomers(): Observable<Customer[]> {
    return this.customersSubject.asObservable();
  }

  /**
   * الحصول على عميل محدد بواسطة المعرف
   */
  getCustomerById(id: number): Observable<Customer | undefined> {
    const customer = this.customers.find(c => c.id === id);
    return of(customer);
  }

  /**
   * إضافة عميل جديد
   */
  addCustomer(customer: Omit<Customer, 'id'>): Observable<Customer> {
    const newId = Math.max(...this.customers.map(c => c.id)) + 1;
    const newCustomer: Customer = {
      ...customer,
      id: newId,
      registrationDate: new Date(),
      totalOrders: 0,
      totalSpent: 0
    };

    this.customers.push(newCustomer);
    this.customersSubject.next([...this.customers]);
    this.updateGroupMembersCounts();

    return of(newCustomer);
  }

  /**
   * تحديث بيانات عميل
   */
  updateCustomer(id: number, customer: Partial<Customer>): Observable<Customer | undefined> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index !== -1) {
      // تحديث بيانات العميل
      this.customers[index] = {
        ...this.customers[index],
        ...customer
      };

      this.customersSubject.next([...this.customers]);
      this.updateGroupMembersCounts();

      return of(this.customers[index]);
    }
    return of(undefined);
  }

  /**
   * حذف عميل
   */
  deleteCustomer(id: number): Observable<boolean> {
    const initialLength = this.customers.length;
    this.customers = this.customers.filter(c => c.id !== id);

    if (initialLength !== this.customers.length) {
      this.customersSubject.next([...this.customers]);
      this.updateGroupMembersCounts();
      return of(true);
    }
    return of(false);
  }

  /**
   * تغيير حالة العميل
   */
  toggleCustomerStatus(id: number, status: 'active' | 'inactive' | 'blocked'): Observable<Customer | undefined> {
    return this.updateCustomer(id, { status });
  }

  /**
   * الحصول على جميع مجموعات العملاء
   */
  getCustomerGroups(): Observable<CustomerGroup[]> {
    return this.customerGroupsSubject.asObservable();
  }

  /**
   * الحصول على مجموعة محددة بواسطة المعرف
   */
  getCustomerGroupById(id: number): Observable<CustomerGroup | undefined> {
    const group = this.customerGroups.find(g => g.id === id);
    return of(group);
  }

  /**
   * إضافة مجموعة جديدة
   */
  addCustomerGroup(group: Omit<CustomerGroup, 'id' | 'membersCount' | 'createdAt'>): Observable<CustomerGroup> {
    const newId = Math.max(...this.customerGroups.map(g => g.id)) + 1;
    const newGroup: CustomerGroup = {
      ...group,
      id: newId,
      membersCount: 0,
      createdAt: new Date()
    };

    this.customerGroups.push(newGroup);
    this.customerGroupsSubject.next([...this.customerGroups]);

    return of(newGroup);
  }

  /**
   * تحديث بيانات مجموعة
   */
  updateCustomerGroup(id: number, group: Partial<CustomerGroup>): Observable<CustomerGroup | undefined> {
    const index = this.customerGroups.findIndex(g => g.id === id);
    if (index !== -1) {
      // تحديث بيانات المجموعة
      this.customerGroups[index] = {
        ...this.customerGroups[index],
        ...group,
        updatedAt: new Date()
      };

      this.customerGroupsSubject.next([...this.customerGroups]);

      // تحديث اسم المجموعة في بيانات العملاء
      if (group.name) {
        this.customers.forEach(customer => {
          if (customer.groupId === id) {
            customer.groupName = group.name;
          }
        });
        this.customersSubject.next([...this.customers]);
      }

      return of(this.customerGroups[index]);
    }
    return of(undefined);
  }

  /**
   * حذف مجموعة
   */
  deleteCustomerGroup(id: number): Observable<boolean> {
    // التحقق من عدم وجود عملاء في المجموعة
    const hasCustomers = this.customers.some(c => c.groupId === id);
    if (hasCustomers) {
      return of(false);
    }

    const initialLength = this.customerGroups.length;
    this.customerGroups = this.customerGroups.filter(g => g.id !== id);

    if (initialLength !== this.customerGroups.length) {
      this.customerGroupsSubject.next([...this.customerGroups]);
      return of(true);
    }
    return of(false);
  }

  /**
   * تغيير حالة المجموعة
   */
  toggleCustomerGroupStatus(id: number, status: 'active' | 'inactive'): Observable<CustomerGroup | undefined> {
    return this.updateCustomerGroup(id, { status });
  }

  /**
   * تحديث عدد الأعضاء في كل مجموعة
   */
  private updateGroupMembersCounts(): void {
    // إعادة تعيين عدد الأعضاء
    this.customerGroups.forEach(group => {
      group.membersCount = 0;
    });

    // حساب عدد الأعضاء في كل مجموعة
    this.customers.forEach(customer => {
      if (customer.groupId) {
        const group = this.customerGroups.find(g => g.id === customer.groupId);
        if (group) {
          group.membersCount++;
        }
      }
    });

    this.customerGroupsSubject.next([...this.customerGroups]);
  }

  /**
   * تعيين مجموعة للعميل
   */
  assignCustomerToGroup(customerId: number, groupId: number): Observable<Customer | undefined> {
    const group = this.customerGroups.find(g => g.id === groupId);
    if (!group) {
      return of(undefined);
    }

    return this.updateCustomer(customerId, {
      groupId,
      groupName: group.name
    });
  }

  /**
   * الحصول على العملاء في مجموعة محددة
   */
  getCustomersByGroup(groupId: number): Observable<Customer[]> {
    const filteredCustomers = this.customers.filter(c => c.groupId === groupId);
    return of(filteredCustomers);
  }
}
