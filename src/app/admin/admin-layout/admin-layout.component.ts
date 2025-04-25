import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: [
    './admin-layout.component.css',
    '../../../assets/admin/css/style.css'
  ]
})
export class AdminLayoutComponent implements OnInit {
  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    // تهيئة المكون عند التحميل
    document.body.classList.add('admin-panel');

    // تحميل ملفات CSS و JS الخاصة بقالب NiceAdmin
    this.loadAdminStyles();
    this.initializeAdminScripts();
  }

  /**
   * تبديل حالة الشريط الجانبي
   */
  toggleSidebar(): void {
    document.body.classList.toggle('toggle-sidebar');
  }

  /**
   * تحميل ملفات CSS الخاصة بقالب NiceAdmin
   */
  private loadAdminStyles(): void {
    // إضافة ملفات CSS
    const styles = [
      'assets/admin/vendor/bootstrap/css/bootstrap.min.css',
      'assets/admin/vendor/bootstrap-icons/bootstrap-icons.css',
      'assets/admin/vendor/boxicons/css/boxicons.min.css',
      'assets/admin/vendor/quill/quill.snow.css',
      'assets/admin/vendor/quill/quill.bubble.css',
      'assets/admin/vendor/remixicon/remixicon.css',
      'assets/admin/vendor/simple-datatables/style.css',
      'assets/admin/css/style.css'
    ];

    styles.forEach(style => {
      const link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'stylesheet');
      this.renderer.setAttribute(link, 'href', style);
      this.renderer.appendChild(this.document.head, link);
    });
  }

  /**
   * تهيئة سكربتات لوحة التحكم
   */
  private initializeAdminScripts(): void {
    // تهيئة سكربتات لوحة التحكم بعد تحميل الصفحة
    setTimeout(() => {
      // تنفيذ الكود الخاص بتهيئة لوحة التحكم
      const mainScript = this.renderer.createElement('script');
      this.renderer.setAttribute(mainScript, 'src', 'assets/admin/js/main.js');
      this.renderer.appendChild(this.document.body, mainScript);
    }, 500);
  }
}
