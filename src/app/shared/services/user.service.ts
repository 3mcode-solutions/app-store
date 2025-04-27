import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, catchError, tap, map } from 'rxjs/operators';
import { User, UserRole, UserStatus } from '../interfaces/user.interface';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    {
      id: 1,
      firstName: 'أحمد',
      lastName: 'محمد',
      email: 'ahmed@example.com',
      phone: '+966500000001',
      avatar: 'assets/img/users/user-1.jpg',
      role: UserRole.Admin,
      status: UserStatus.Active,
      address: {
        street: 'شارع الملك فهد',
        city: 'الرياض',
        state: 'الرياض',
        postalCode: '12345',
        country: 'المملكة العربية السعودية'
      },
      createdAt: new Date('2023-01-15'),
      lastLogin: new Date('2023-10-25T10:30:00'),
      isVerified: true
    },
    {
      id: 2,
      firstName: 'سارة',
      lastName: 'أحمد',
      email: 'sara@example.com',
      phone: '+966500000002',
      avatar: 'assets/img/users/user-2.jpg',
      role: UserRole.Customer,
      status: UserStatus.Active,
      address: {
        street: 'شارع التحلية',
        city: 'جدة',
        state: 'مكة المكرمة',
        postalCode: '23456',
        country: 'المملكة العربية السعودية'
      },
      createdAt: new Date('2023-02-20'),
      lastLogin: new Date('2023-10-20T15:45:00'),
      isVerified: true
    },
    {
      id: 3,
      firstName: 'محمد',
      lastName: 'علي',
      email: 'mohamed@example.com',
      phone: '+966500000003',
      avatar: 'assets/img/users/user-3.jpg',
      role: UserRole.Editor,
      status: UserStatus.Active,
      address: {
        street: 'شارع الأمير سلطان',
        city: 'الدمام',
        state: 'المنطقة الشرقية',
        postalCode: '34567',
        country: 'المملكة العربية السعودية'
      },
      createdAt: new Date('2023-03-10'),
      lastLogin: new Date('2023-10-22T11:20:00'),
      isVerified: true
    },
    {
      id: 4,
      firstName: 'فاطمة',
      lastName: 'محمد',
      email: 'fatima@example.com',
      phone: '+966500000004',
      avatar: 'assets/img/users/user-4.jpg',
      role: UserRole.Customer,
      status: UserStatus.Inactive,
      address: {
        street: 'شارع الملك عبدالله',
        city: 'المدينة المنورة',
        state: 'المدينة المنورة',
        postalCode: '45678',
        country: 'المملكة العربية السعودية'
      },
      createdAt: new Date('2023-04-05'),
      lastLogin: new Date('2023-09-15T09:15:00'),
      isVerified: true
    },
    {
      id: 5,
      firstName: 'خالد',
      lastName: 'عبدالله',
      email: 'khaled@example.com',
      phone: '+966500000005',
      avatar: 'assets/img/users/user-5.jpg',
      role: UserRole.Vendor,
      status: UserStatus.Suspended,
      address: {
        street: 'شارع العليا',
        city: 'الرياض',
        state: 'الرياض',
        postalCode: '12345',
        country: 'المملكة العربية السعودية'
      },
      createdAt: new Date('2023-05-12'),
      lastLogin: new Date('2023-10-18T14:30:00'),
      isVerified: true,
      notes: 'تم إيقاف الحساب مؤقتًا بسبب مخالفة شروط الاستخدام'
    },
    {
      id: 6,
      firstName: 'نورة',
      lastName: 'سعيد',
      email: 'noura@example.com',
      phone: '+966500000006',
      avatar: 'assets/img/users/user-6.jpg',
      role: UserRole.Customer,
      status: UserStatus.Pending,
      createdAt: new Date('2023-10-01'),
      isVerified: false
    },
    {
      id: 7,
      firstName: 'عبدالله',
      lastName: 'محمد',
      email: 'abdullah@example.com',
      phone: '+966500000007',
      avatar: 'assets/img/users/user-7.jpg',
      role: UserRole.Customer,
      status: UserStatus.Active,
      address: {
        street: 'شارع الملك خالد',
        city: 'أبها',
        state: 'عسير',
        postalCode: '56789',
        country: 'المملكة العربية السعودية'
      },
      createdAt: new Date('2023-06-18'),
      lastLogin: new Date('2023-10-24T16:45:00'),
      isVerified: true
    },
    {
      id: 8,
      firstName: 'ليلى',
      lastName: 'أحمد',
      email: 'layla@example.com',
      phone: '+966500000008',
      avatar: 'assets/img/users/user-8.jpg',
      role: UserRole.Customer,
      status: UserStatus.Active,
      address: {
        street: 'شارع الأمير محمد',
        city: 'الطائف',
        state: 'مكة المكرمة',
        postalCode: '67890',
        country: 'المملكة العربية السعودية'
      },
      createdAt: new Date('2023-07-22'),
      lastLogin: new Date('2023-10-23T10:10:00'),
      isVerified: true
    }
  ];

  constructor(private apiService: ApiService) { }

  /**
   * الحصول على جميع المستخدمين
   */
  getUsers(): Observable<User[]> {
    // استخدام API حقيقي دائمًا
    return this.apiService.get<User[]>('users').pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        return of([...this.users]);
      })
    );
  }

  /**
   * الحصول على مستخدم بواسطة المعرف
   */
  getUserById(id: number): Observable<User | undefined> {
    // استخدام API حقيقي دائمًا
    return this.apiService.get<User>(`users/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching user with id ${id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const user = this.users.find(u => u.id === id);
        return of(user);
      })
    );
  }

  /**
   * الحصول على المستخدمين حسب الدور
   */
  getUsersByRole(role: UserRole): Observable<User[]> {
    // استخدام API حقيقي دائمًا
    const params = new HttpParams().set('role', role);
    return this.apiService.get<User[]>('users', params).pipe(
      catchError(error => {
        console.error(`Error fetching users with role ${role}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const filteredUsers = this.users.filter(u => u.role === role);
        return of(filteredUsers);
      })
    );
  }

  /**
   * إضافة مستخدم جديد
   */
  addUser(user: User): Observable<User> {
    // استخدام API حقيقي دائمًا
    return this.apiService.post<User>('users', user).pipe(
      tap(newUser => {
        // إضافة المستخدم الجديد إلى الذاكرة المؤقتة
        this.users.push(newUser);
      }),
      catchError(error => {
        console.error('Error adding user:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const newId = Math.max(...this.users.map(u => u.id)) + 1;
        const newUser = { ...user, id: newId, createdAt: new Date() };
        this.users.push(newUser);
        return of(newUser);
      })
    );
  }

  /**
   * تحديث مستخدم موجود
   */
  updateUser(user: User): Observable<User> {
    // استخدام API حقيقي دائمًا
    return this.apiService.put<User>(`users/${user.id}`, user).pipe(
      tap(updatedUser => {
        // تحديث المستخدم في الذاكرة المؤقتة
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
      }),
      catchError(error => {
        console.error(`Error updating user with id ${user.id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = { ...user };
          return of(this.users[index]);
        }
        return of(user);
      })
    );
  }

  /**
   * تحديث حالة المستخدم
   */
  updateUserStatus(id: number, status: UserStatus): Observable<User | undefined> {
    // استخدام API حقيقي دائمًا
    return this.apiService.patch<User>(`users/${id}/status`, { status }).pipe(
      tap(updatedUser => {
        // تحديث المستخدم في الذاكرة المؤقتة
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
      }),
      catchError(error => {
        console.error(`Error updating user status with id ${id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const user = this.users.find(u => u.id === id);
        if (user) {
          user.status = status;
          return of(user);
        }
        return of(undefined);
      })
    );
  }

  /**
   * حذف مستخدم
   */
  deleteUser(id: number): Observable<boolean> {
    // استخدام API حقيقي دائمًا
    return this.apiService.delete<any>(`users/${id}`).pipe(
      map(() => {
        // حذف المستخدم من الذاكرة المؤقتة
        this.users = this.users.filter(u => u.id !== id);
        return true;
      }),
      catchError(error => {
        console.error(`Error deleting user with id ${id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        return of(false);
      })
    );
  }

  /**
   * البحث عن مستخدمين
   */
  searchUsers(query: string): Observable<User[]> {
    if (!query.trim()) {
      return of([]);
    }

    // استخدام API حقيقي دائمًا
    const params = new HttpParams().set('query', query);
    return this.apiService.get<User[]>('users/search', params).pipe(
      catchError(error => {
        console.error(`Error searching users with query "${query}":`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const searchTerm = query.toLowerCase();
        const results = this.users.filter(user =>
          user.firstName.toLowerCase().includes(searchTerm) ||
          user.lastName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          (user.phone && user.phone.includes(searchTerm))
        );
        return of(results);
      })
    );
  }

  /**
   * الحصول على إحصائيات المستخدمين
   */
  getUserStats(): Observable<any> {
    // استخدام API حقيقي دائمًا
    return this.apiService.get<any>('users/stats').pipe(
      catchError(error => {
        console.error('Error fetching user stats:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const totalUsers = this.users.length;
        const activeUsers = this.users.filter(u => u.status === UserStatus.Active).length;
        const inactiveUsers = this.users.filter(u => u.status === UserStatus.Inactive).length;
        const suspendedUsers = this.users.filter(u => u.status === UserStatus.Suspended).length;
        const pendingUsers = this.users.filter(u => u.status === UserStatus.Pending).length;

        const adminUsers = this.users.filter(u => u.role === UserRole.Admin).length;
        const customerUsers = this.users.filter(u => u.role === UserRole.Customer).length;
        const editorUsers = this.users.filter(u => u.role === UserRole.Editor).length;
        const vendorUsers = this.users.filter(u => u.role === UserRole.Vendor).length;

        const verifiedUsers = this.users.filter(u => u.isVerified).length;
        const unverifiedUsers = this.users.filter(u => !u.isVerified).length;

        const stats = {
          totalUsers,
          activeUsers,
          inactiveUsers,
          suspendedUsers,
          pendingUsers,
          adminUsers,
          customerUsers,
          editorUsers,
          vendorUsers,
          verifiedUsers,
          unverifiedUsers
        };

        return of(stats);
      })
    );
  }
}
