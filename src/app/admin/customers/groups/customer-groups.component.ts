import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerGroup } from '../../../shared/models/customer.model';
import { CustomerService } from '../../../shared/services/customer.service';

@Component({
  selector: 'app-customer-groups',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './customer-groups.component.html',
  styleUrls: ['./customer-groups.component.css']
})
export class CustomerGroupsComponent implements OnInit {
  customerGroups: CustomerGroup[] = [];

  // نموذج إضافة/تعديل مجموعة
  groupForm = {
    id: 0,
    name: '',
    description: '',
    discount: 0,
    status: 'active' as 'active' | 'inactive'
  };

  isEditing: boolean = false;
  isLoading: boolean = true;

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.loadCustomerGroups();
  }

  /**
   * تحميل مجموعات العملاء
   */
  loadCustomerGroups(): void {
    this.isLoading = true;

    this.customerService.getCustomerGroups().subscribe(groups => {
      this.customerGroups = groups;
      this.isLoading = false;
    });
  }

  /**
   * فتح نموذج إضافة مجموعة جديدة
   */
  openAddForm(): void {
    this.isEditing = false;
    this.groupForm = {
      id: 0,
      name: '',
      description: '',
      discount: 0,
      status: 'active'
    };
  }

  /**
   * فتح نموذج تعديل مجموعة
   */
  openEditForm(group: CustomerGroup): void {
    this.isEditing = true;
    this.groupForm = {
      id: group.id,
      name: group.name,
      description: group.description,
      discount: group.discount,
      status: group.status
    };
  }

  /**
   * حفظ المجموعة (إضافة/تعديل)
   */
  saveGroup(): void {
    if (!this.groupForm.name) {
      alert('يرجى إدخال اسم المجموعة');
      return;
    }

    if (this.isEditing) {
      // تعديل مجموعة موجودة
      this.customerService.updateCustomerGroup(this.groupForm.id, {
        name: this.groupForm.name,
        description: this.groupForm.description,
        discount: this.groupForm.discount,
        status: this.groupForm.status
      }).subscribe(updatedGroup => {
        if (updatedGroup) {
          alert('تم تعديل المجموعة بنجاح');
          this.loadCustomerGroups();
        } else {
          alert('حدث خطأ أثناء تعديل المجموعة');
        }
      });
    } else {
      // إضافة مجموعة جديدة
      this.customerService.addCustomerGroup({
        name: this.groupForm.name,
        description: this.groupForm.description,
        discount: this.groupForm.discount,
        status: this.groupForm.status
      }).subscribe(newGroup => {
        alert('تم إضافة المجموعة بنجاح');
        this.loadCustomerGroups();
      });
    }

    // إعادة تعيين النموذج
    this.groupForm = {
      id: 0,
      name: '',
      description: '',
      discount: 0,
      status: 'active'
    };
  }

  /**
   * حذف مجموعة
   */
  deleteGroup(id: number): void {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذه المجموعة؟')) {
      this.customerService.deleteCustomerGroup(id).subscribe(success => {
        if (success) {
          alert('تم حذف المجموعة بنجاح');
          this.loadCustomerGroups();
        } else {
          alert('لا يمكن حذف هذه المجموعة لأنها تحتوي على عملاء');
        }
      });
    }
  }

  /**
   * تغيير حالة المجموعة
   */
  toggleGroupStatus(group: CustomerGroup): void {
    const newStatus = group.status === 'active' ? 'inactive' : 'active';

    this.customerService.toggleCustomerGroupStatus(group.id, newStatus).subscribe(updatedGroup => {
      if (updatedGroup) {
        alert(`تم ${newStatus === 'active' ? 'تفعيل' : 'تعطيل'} المجموعة بنجاح`);
        this.loadCustomerGroups();
      }
    });
  }
}
