import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastrService } from '../../shared/services/toastr.service';

// تعريف واجهة الصفحة
interface Page {
  id: number;
  slug: string;
  title: string;
  content: string;
  metaDescription: string;
  metaKeywords: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// تعريف واجهة إنشاء صفحة جديدة
interface CreatePage {
  slug: string;
  title: string;
  content: string;
  metaDescription: string;
  metaKeywords: string;
  isActive: boolean;
}

// تعريف واجهة تحديث صفحة
interface UpdatePage {
  title: string;
  content: string;
  metaDescription: string;
  metaKeywords: string;
  isActive: boolean;
}

declare var bootstrap: any;
declare var ClassicEditor: any;

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
  // قائمة الصفحات
  pages: Page[] = [];
  
  // الصفحة المحددة
  selectedPage: Page | null = null;
  
  // نموذج الصفحة
  pageForm: FormGroup;
  
  // حالة التحميل
  isLoading = false;
  
  // حالة التحرير
  isEditMode = false;
  
  // محرر النصوص
  editor: any;
  
  // النوافذ المنبثقة
  pageModal: any;
  deleteModal: any;
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    // إنشاء نموذج الصفحة
    this.pageForm = this.fb.group({
      slug: ['', [Validators.required, Validators.pattern('^[a-z0-9-]+$')]],
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      metaDescription: ['', [Validators.maxLength(500)]],
      metaKeywords: ['', [Validators.maxLength(500)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    // تحميل الصفحات
    this.loadPages();
    
    // تهيئة النوافذ المنبثقة
    setTimeout(() => {
      this.initModals();
    }, 500);
  }

  /**
   * تهيئة النوافذ المنبثقة
   */
  initModals(): void {
    this.pageModal = new bootstrap.Modal(document.getElementById('pageModal'));
    this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  }

  /**
   * تحميل الصفحات
   */
  loadPages(): void {
    this.isLoading = true;
    this.http.get<Page[]>(`${environment.apiUrl}/pages`).subscribe({
      next: (pages) => {
        this.pages = pages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading pages:', error);
        this.toastr.error('حدث خطأ أثناء تحميل الصفحات');
        this.isLoading = false;
      }
    });
  }

  /**
   * فتح نافذة إضافة صفحة جديدة
   */
  openAddPageModal(): void {
    this.isEditMode = false;
    this.pageForm.reset({
      isActive: true
    });
    
    // تمكين حقل الـ slug
    this.pageForm.get('slug')?.enable();
    
    this.pageModal.show();
    
    // تهيئة محرر النصوص
    setTimeout(() => {
      this.initEditor();
    }, 500);
  }

  /**
   * فتح نافذة تعديل صفحة
   */
  editPage(page: Page): void {
    this.isEditMode = true;
    this.selectedPage = page;
    
    this.pageForm.patchValue({
      slug: page.slug,
      title: page.title,
      content: page.content,
      metaDescription: page.metaDescription,
      metaKeywords: page.metaKeywords,
      isActive: page.isActive
    });
    
    // تعطيل حقل الـ slug في وضع التعديل
    this.pageForm.get('slug')?.disable();
    
    this.pageModal.show();
    
    // تهيئة محرر النصوص
    setTimeout(() => {
      this.initEditor();
    }, 500);
  }

  /**
   * تهيئة محرر النصوص
   */
  initEditor(): void {
    // التحقق من وجود محرر سابق وتدميره
    if (this.editor) {
      this.editor.destroy();
    }
    
    // تهيئة محرر النصوص الجديد
    ClassicEditor
      .create(document.querySelector('#pageContent'), {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'outdent', 'indent', '|', 'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', 'undo', 'redo'],
        language: 'ar',
        image: {
          toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side']
        }
      })
      .then((editor: any) => {
        this.editor = editor;
        
        // ربط المحرر بنموذج الصفحة
        editor.model.document.on('change:data', () => {
          this.pageForm.patchValue({
            content: editor.getData()
          });
        });
        
        // تعيين محتوى المحرر
        editor.setData(this.pageForm.get('content')?.value || '');
      })
      .catch((error: any) => {
        console.error('Error initializing editor:', error);
      });
  }

  /**
   * حفظ الصفحة (إضافة أو تعديل)
   */
  savePage(): void {
    if (this.pageForm.invalid) {
      // تحديد جميع الحقول كـ "تم لمسها" لإظهار رسائل الخطأ
      Object.keys(this.pageForm.controls).forEach(key => {
        const control = this.pageForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    this.isLoading = true;
    
    if (this.isEditMode) {
      // تعديل صفحة موجودة
      const updateData: UpdatePage = {
        title: this.pageForm.get('title')?.value,
        content: this.pageForm.get('content')?.value,
        metaDescription: this.pageForm.get('metaDescription')?.value,
        metaKeywords: this.pageForm.get('metaKeywords')?.value,
        isActive: this.pageForm.get('isActive')?.value
      };
      
      this.http.put(`${environment.apiUrl}/pages/${this.selectedPage?.id}`, updateData).subscribe({
        next: () => {
          this.toastr.success('تم تحديث الصفحة بنجاح');
          this.loadPages();
          this.pageModal.hide();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating page:', error);
          this.toastr.error('حدث خطأ أثناء تحديث الصفحة');
          this.isLoading = false;
        }
      });
    } else {
      // إضافة صفحة جديدة
      const createData: CreatePage = {
        slug: this.pageForm.get('slug')?.value,
        title: this.pageForm.get('title')?.value,
        content: this.pageForm.get('content')?.value,
        metaDescription: this.pageForm.get('metaDescription')?.value,
        metaKeywords: this.pageForm.get('metaKeywords')?.value,
        isActive: this.pageForm.get('isActive')?.value
      };
      
      this.http.post(`${environment.apiUrl}/pages`, createData).subscribe({
        next: () => {
          this.toastr.success('تم إضافة الصفحة بنجاح');
          this.loadPages();
          this.pageModal.hide();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creating page:', error);
          this.toastr.error('حدث خطأ أثناء إضافة الصفحة');
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * فتح نافذة حذف صفحة
   */
  deletePage(page: Page): void {
    this.selectedPage = page;
    this.deleteModal.show();
  }

  /**
   * تأكيد حذف الصفحة
   */
  confirmDelete(): void {
    if (!this.selectedPage) return;
    
    this.isLoading = true;
    
    this.http.delete(`${environment.apiUrl}/pages/${this.selectedPage.id}`).subscribe({
      next: () => {
        this.toastr.success('تم حذف الصفحة بنجاح');
        this.loadPages();
        this.deleteModal.hide();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error deleting page:', error);
        this.toastr.error('حدث خطأ أثناء حذف الصفحة');
        this.isLoading = false;
      }
    });
  }

  /**
   * معاينة الصفحة
   */
  previewPage(page: Page): void {
    // فتح الصفحة في نافذة جديدة
    window.open(`/${page.slug}`, '_blank');
  }

  /**
   * تنسيق التاريخ
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('ar-EG');
  }
}
