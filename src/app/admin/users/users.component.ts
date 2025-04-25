import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { User, UserRole, UserStatus } from '../../shared/interfaces/user.interface';
import { UserService } from '../../shared/services/user.service';
import { ToastrService } from '../../shared/services/toastr.service';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  // بيانات المستخدمين
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;

  // إحصائيات المستخدمين
  userStats: any = {
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    suspendedUsers: 0,
    pendingUsers: 0,
    adminUsers: 0,
    customerUsers: 0,
    editorUsers: 0,
    vendorUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0
  };

  // نموذج المستخدم
  userForm: FormGroup;
  isEditMode = false;

  // نموذج تحديث الحالة
  statusForm: FormGroup;

  // فلترة وترتيب
  searchTerm = '';
  roleFilter = '';
  statusFilter = '';

  // ترقيم الصفحات
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // النوافذ المنبثقة
  userModal: any;
  updateStatusModal: any;
  deleteModal: any;
  detailsModal: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    // إنشاء نموذج المستخدم
    this.userForm = this.fb.group({
      id: [null],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: [UserRole.Customer, [Validators.required]],
      status: [UserStatus.Active, [Validators.required]],
      avatar: [''],
      isVerified: [false],
      notes: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        postalCode: [''],
        country: ['']
      })
    });

    // إنشاء نموذج تحديث الحالة
    this.statusForm = this.fb.group({
      userStatus: [UserStatus.Active, [Validators.required]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    // تحميل البيانات
    this.loadUsers();
    this.loadUserStats();

    // تهيئة النوافذ المنبثقة
    this.initModals();
  }

  /**
   * تحميل المستخدمين
   */
  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.applyFilter();
      },
      (error) => {
        console.error('Error loading users:', error);
        this.toastr.error('حدث خطأ أثناء تحميل المستخدمين');
      }
    );
  }

  /**
   * تحميل إحصائيات المستخدمين
   */
  loadUserStats(): void {
    this.userService.getUserStats().subscribe(
      (stats) => {
        this.userStats = stats;
      },
      (error) => {
        console.error('Error loading user stats:', error);
      }
    );
  }

  /**
   * تهيئة النوافذ المنبثقة
   */
  initModals(): void {
    setTimeout(() => {
      this.userModal = new bootstrap.Modal(document.getElementById('userModal'));
      this.updateStatusModal = new bootstrap.Modal(document.getElementById('updateStatusModal'));
      this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
      this.detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    }, 500);
  }

  /**
   * تطبيق الفلترة والترتيب
   */
  applyFilter(): void {
    // تطبيق الفلترة
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm ||
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(this.searchTerm));

      const matchesRole = !this.roleFilter || user.role === this.roleFilter;
      const matchesStatus = !this.statusFilter || user.status === this.statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });

    // حساب عدد الصفحات
    this.calculatePagination();
  }

  /**
   * حساب ترقيم الصفحات
   */
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);

    // تعديل الصفحة الحالية إذا كانت خارج النطاق
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }

    // تطبيق ترقيم الصفحات
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredUsers = this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
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
   * الحصول على اسم دور المستخدم
   */
  getUserRoleName(role: UserRole): string {
    switch (role) {
      case UserRole.Admin:
        return 'مدير';
      case UserRole.Customer:
        return 'عميل';
      case UserRole.Editor:
        return 'محرر';
      case UserRole.Vendor:
        return 'بائع';
      default:
        return 'غير معروف';
    }
  }

  /**
   * الحصول على اسم حالة المستخدم
   */
  getUserStatusName(status: UserStatus): string {
    switch (status) {
      case UserStatus.Active:
        return 'نشط';
      case UserStatus.Inactive:
        return 'غير نشط';
      case UserStatus.Suspended:
        return 'موقوف';
      case UserStatus.Pending:
        return 'قيد الانتظار';
      default:
        return 'غير معروف';
    }
  }

  /**
   * الحصول على صنف CSS لحالة المستخدم
   */
  getUserStatusClass(status: UserStatus): string {
    switch (status) {
      case UserStatus.Active:
        return 'badge bg-success';
      case UserStatus.Inactive:
        return 'badge bg-secondary';
      case UserStatus.Suspended:
        return 'badge bg-danger';
      case UserStatus.Pending:
        return 'badge bg-warning';
      default:
        return 'badge bg-light';
    }
  }

  /**
   * فتح نافذة إضافة مستخدم جديد
   */
  openAddUserModal(): void {
    this.isEditMode = false;
    this.userForm.reset({
      role: UserRole.Customer,
      status: UserStatus.Active,
      isVerified: false,
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      }
    });
    this.userModal.show();
  }

  /**
   * فتح نافذة تعديل مستخدم
   */
  editUser(user: User): void {
    this.isEditMode = true;
    this.selectedUser = user;

    this.userForm.patchValue({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      status: user.status,
      avatar: user.avatar || '',
      isVerified: user.isVerified,
      notes: user.notes || '',
      address: user.address || {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      }
    });

    this.userModal.show();
  }

  /**
   * حفظ المستخدم (إضافة أو تعديل)
   */
  saveUser(): void {
    if (this.userForm.invalid) {
      // تحديد جميع الحقول كـ "تم لمسها" لإظهار رسائل الخطأ
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const userData = this.userForm.value;

    if (this.isEditMode) {
      // تعديل مستخدم موجود
      this.userService.updateUser(userData).subscribe(
        () => {
          this.toastr.success('تم تعديل المستخدم بنجاح');
          this.loadUsers();
          this.loadUserStats();
          this.userModal.hide();
        },
        (error) => {
          console.error('Error updating user:', error);
          this.toastr.error('حدث خطأ أثناء تعديل المستخدم');
        }
      );
    } else {
      // إضافة مستخدم جديد
      this.userService.addUser(userData).subscribe(
        () => {
          this.toastr.success('تم إضافة المستخدم بنجاح');
          this.loadUsers();
          this.loadUserStats();
          this.userModal.hide();
        },
        (error) => {
          console.error('Error adding user:', error);
          this.toastr.error('حدث خطأ أثناء إضافة المستخدم');
        }
      );
    }
  }

  /**
   * فتح نافذة تحديث حالة المستخدم
   */
  updateUserStatus(user: User): void {
    this.selectedUser = user;

    this.statusForm.patchValue({
      userStatus: user.status,
      notes: user.notes || ''
    });

    this.updateStatusModal.show();
  }

  /**
   * تأكيد تحديث حالة المستخدم
   */
  confirmUpdateStatus(): void {
    if (!this.selectedUser) return;

    const formValues = this.statusForm.value;

    // تحديث حالة المستخدم
    this.userService.updateUserStatus(this.selectedUser.id, formValues.userStatus).subscribe(
      (updatedUser) => {
        if (updatedUser) {
          // تحديث الملاحظات
          updatedUser.notes = formValues.notes;
          this.userService.updateUser(updatedUser).subscribe(
            () => {
              this.toastr.success('تم تحديث حالة المستخدم بنجاح');
              this.loadUsers();
              this.loadUserStats();
              this.updateStatusModal.hide();
            },
            (error) => {
              console.error('Error updating user notes:', error);
              this.toastr.error('حدث خطأ أثناء تحديث ملاحظات المستخدم');
            }
          );
        }
      },
      (error) => {
        console.error('Error updating user status:', error);
        this.toastr.error('حدث خطأ أثناء تحديث حالة المستخدم');
      }
    );
  }

  /**
   * فتح نافذة حذف مستخدم
   */
  deleteUser(user: User): void {
    this.selectedUser = user;
    this.deleteModal.show();
  }

  /**
   * تأكيد حذف المستخدم
   */
  confirmDelete(): void {
    if (!this.selectedUser) return;

    this.userService.deleteUser(this.selectedUser.id).subscribe(
      (success) => {
        if (success) {
          this.toastr.success('تم حذف المستخدم بنجاح');
          this.loadUsers();
          this.loadUserStats();
          this.deleteModal.hide();
        } else {
          this.toastr.error('حدث خطأ أثناء حذف المستخدم');
        }
      },
      (error) => {
        console.error('Error deleting user:', error);
        this.toastr.error('حدث خطأ أثناء حذف المستخدم');
      }
    );
  }

  /**
   * عرض تفاصيل المستخدم
   */
  viewUserDetails(user: User): void {
    this.selectedUser = user;
    this.detailsModal.show();
  }
}
