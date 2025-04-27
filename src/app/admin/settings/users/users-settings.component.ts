import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from '../../../shared/services/toastr.service';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: Date | null;
}

interface Role {
  id: number;
  name: string;
  permissions: string[];
}

@Component({
  selector: 'app-users-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-settings.component.html',
  styleUrls: ['./users-settings.component.css']
})
export class UsersSettingsComponent implements OnInit {
  users: User[] = [
    {
      id: 1,
      name: 'أحمد محمد',
      email: 'admin@example.com',
      role: 'مدير',
      status: 'active',
      lastLogin: new Date(2023, 10, 15, 10, 30)
    },
    {
      id: 2,
      name: 'سارة أحمد',
      email: 'sara@example.com',
      role: 'محرر',
      status: 'active',
      lastLogin: new Date(2023, 10, 14, 14, 45)
    },
    {
      id: 3,
      name: 'محمد علي',
      email: 'mohamed@example.com',
      role: 'مشرف',
      status: 'active',
      lastLogin: new Date(2023, 10, 10, 9, 15)
    },
    {
      id: 4,
      name: 'فاطمة حسن',
      email: 'fatima@example.com',
      role: 'محرر',
      status: 'inactive',
      lastLogin: null
    }
  ];

  roles: Role[] = [
    {
      id: 1,
      name: 'مدير',
      permissions: ['إدارة المستخدمين', 'إدارة المنتجات', 'إدارة الطلبات', 'إدارة التقارير', 'إدارة الإعدادات']
    },
    {
      id: 2,
      name: 'مشرف',
      permissions: ['إدارة المنتجات', 'إدارة الطلبات', 'عرض التقارير']
    },
    {
      id: 3,
      name: 'محرر',
      permissions: ['إدارة المنتجات', 'عرض الطلبات']
    },
    {
      id: 4,
      name: 'مستخدم',
      permissions: ['عرض المنتجات']
    }
  ];

  // نموذج إضافة/تعديل مستخدم
  userForm = {
    id: 0,
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    status: 'active'
  };

  // نموذج إضافة/تعديل دور
  roleForm = {
    id: 0,
    name: '',
    permissions: {
      manageUsers: false,
      manageProducts: false,
      manageOrders: false,
      viewReports: false,
      manageReports: false,
      manageSettings: false
    }
  };

  isEditingUser: boolean = false;
  isEditingRole: boolean = false;
  activeTab: 'users' | 'roles' = 'users';

  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  /**
   * تبديل التبويب النشط
   */
  setActiveTab(tab: 'users' | 'roles'): void {
    this.activeTab = tab;
  }

  /**
   * فتح نموذج إضافة مستخدم جديد
   */
  openAddUserForm(): void {
    this.isEditingUser = false;
    this.userForm = {
      id: 0,
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      status: 'active'
    };
  }

  /**
   * فتح نموذج تعديل مستخدم
   */
  openEditUserForm(user: User): void {
    this.isEditingUser = true;
    this.userForm = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
      confirmPassword: '',
      role: user.role,
      status: user.status
    };
  }

  /**
   * حفظ المستخدم (إضافة/تعديل)
   */
  saveUser(): void {
    if (!this.userForm.name || !this.userForm.email || !this.userForm.role) {
      this.toastr.error('يرجى ملء جميع الحقول المطلوبة', 'خطأ في النموذج');
      return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.userForm.email)) {
      this.toastr.error('يرجى إدخال بريد إلكتروني صحيح', 'خطأ في النموذج');
      return;
    }

    // التحقق من تطابق كلمة المرور
    if (this.userForm.password !== this.userForm.confirmPassword) {
      this.toastr.error('كلمة المرور غير متطابقة', 'خطأ في النموذج');
      return;
    }

    if (this.isEditingUser) {
      // تعديل مستخدم موجود
      const index = this.users.findIndex(u => u.id === this.userForm.id);
      if (index !== -1) {
        this.users[index] = {
          ...this.users[index],
          name: this.userForm.name,
          email: this.userForm.email,
          role: this.userForm.role,
          status: this.userForm.status as 'active' | 'inactive'
        };
        this.toastr.success('تم تعديل المستخدم بنجاح', 'المستخدمين');
      }
    } else {
      // إضافة مستخدم جديد
      if (!this.userForm.password) {
        this.toastr.error('يرجى إدخال كلمة المرور', 'خطأ في النموذج');
        return;
      }

      const newId = Math.max(...this.users.map(u => u.id)) + 1;
      this.users.push({
        id: newId,
        name: this.userForm.name,
        email: this.userForm.email,
        role: this.userForm.role,
        status: this.userForm.status as 'active' | 'inactive',
        lastLogin: null
      });
      this.toastr.success('تم إضافة المستخدم بنجاح', 'المستخدمين');
    }

    // إعادة تعيين النموذج
    this.userForm = {
      id: 0,
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      status: 'active'
    };
  }

  /**
   * حذف مستخدم
   */
  deleteUser(id: number): void {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا المستخدم؟')) {
      this.users = this.users.filter(u => u.id !== id);
      this.toastr.success('تم حذف المستخدم بنجاح', 'المستخدمين');
    }
  }

  /**
   * فتح نموذج إضافة دور جديد
   */
  openAddRoleForm(): void {
    this.isEditingRole = false;
    this.roleForm = {
      id: 0,
      name: '',
      permissions: {
        manageUsers: false,
        manageProducts: false,
        manageOrders: false,
        viewReports: false,
        manageReports: false,
        manageSettings: false
      }
    };
  }

  /**
   * فتح نموذج تعديل دور
   */
  openEditRoleForm(role: Role): void {
    this.isEditingRole = true;
    this.roleForm = {
      id: role.id,
      name: role.name,
      permissions: {
        manageUsers: role.permissions.includes('إدارة المستخدمين'),
        manageProducts: role.permissions.includes('إدارة المنتجات'),
        manageOrders: role.permissions.includes('إدارة الطلبات'),
        viewReports: role.permissions.includes('عرض التقارير'),
        manageReports: role.permissions.includes('إدارة التقارير'),
        manageSettings: role.permissions.includes('إدارة الإعدادات')
      }
    };
  }

  /**
   * حفظ الدور (إضافة/تعديل)
   */
  saveRole(): void {
    if (!this.roleForm.name) {
      this.toastr.error('يرجى إدخال اسم الدور', 'خطأ في النموذج');
      return;
    }

    // تحويل الصلاحيات إلى مصفوفة
    const permissions: string[] = [];
    if (this.roleForm.permissions.manageUsers) permissions.push('إدارة المستخدمين');
    if (this.roleForm.permissions.manageProducts) permissions.push('إدارة المنتجات');
    if (this.roleForm.permissions.manageOrders) permissions.push('إدارة الطلبات');
    if (this.roleForm.permissions.viewReports) permissions.push('عرض التقارير');
    if (this.roleForm.permissions.manageReports) permissions.push('إدارة التقارير');
    if (this.roleForm.permissions.manageSettings) permissions.push('إدارة الإعدادات');

    if (this.isEditingRole) {
      // تعديل دور موجود
      const index = this.roles.findIndex(r => r.id === this.roleForm.id);
      if (index !== -1) {
        this.roles[index] = {
          ...this.roles[index],
          name: this.roleForm.name,
          permissions: permissions
        };
        this.toastr.success('تم تعديل الدور بنجاح', 'الأدوار');
      }
    } else {
      // إضافة دور جديد
      const newId = Math.max(...this.roles.map(r => r.id)) + 1;
      this.roles.push({
        id: newId,
        name: this.roleForm.name,
        permissions: permissions
      });
      this.toastr.success('تم إضافة الدور بنجاح', 'الأدوار');
    }

    // إعادة تعيين النموذج
    this.roleForm = {
      id: 0,
      name: '',
      permissions: {
        manageUsers: false,
        manageProducts: false,
        manageOrders: false,
        viewReports: false,
        manageReports: false,
        manageSettings: false
      }
    };
  }

  /**
   * حذف دور
   */
  deleteRole(id: number): void {
    // التحقق من عدم استخدام الدور
    if (this.users.some(u => u.role === this.roles.find(r => r.id === id)?.name)) {
      this.toastr.error('لا يمكن حذف هذا الدور لأنه مستخدم من قبل مستخدم واحد أو أكثر', 'خطأ');
      return;
    }

    if (confirm('هل أنت متأكد من رغبتك في حذف هذا الدور؟')) {
      this.roles = this.roles.filter(r => r.id !== id);
      this.toastr.success('تم حذف الدور بنجاح', 'الأدوار');
    }
  }

  /**
   * تنسيق التاريخ
   */
  formatDate(date: Date | null): string {
    if (!date) return 'لم يسجل الدخول بعد';
    return date.toLocaleDateString('ar-EG') + ' ' + date.toLocaleTimeString('ar-EG');
  }
}
