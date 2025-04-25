import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  templateUrl: './admin.component.html',
  styleUrls: [
    './admin.component.css',
    '../../assets/admin/css/style.css'
  ]
})
export class AdminComponent implements OnInit {

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    // تهيئة المكون عند التحميل
    this.loadStyles();
    this.loadScripts();
  }

  /**
   * تبديل حالة الشريط الجانبي
   */
  toggleSidebar(): void {
    document.body.classList.toggle('toggle-sidebar');
  }

  /**
   * تحميل ملفات CSS اللازمة
   */
  private loadStyles(): void {
    // Bootstrap Icons
    const bootstrapIconsLink = this.renderer.createElement('link');
    this.renderer.setAttribute(bootstrapIconsLink, 'rel', 'stylesheet');
    this.renderer.setAttribute(bootstrapIconsLink, 'href', 'assets/admin/vendor/bootstrap-icons/bootstrap-icons.css');
    this.renderer.appendChild(this.document.head, bootstrapIconsLink);

    // Boxicons
    const boxiconsLink = this.renderer.createElement('link');
    this.renderer.setAttribute(boxiconsLink, 'rel', 'stylesheet');
    this.renderer.setAttribute(boxiconsLink, 'href', 'assets/admin/vendor/boxicons/css/boxicons.min.css');
    this.renderer.appendChild(this.document.head, boxiconsLink);

    // Remixicon
    const remixiconLink = this.renderer.createElement('link');
    this.renderer.setAttribute(remixiconLink, 'rel', 'stylesheet');
    this.renderer.setAttribute(remixiconLink, 'href', 'assets/admin/vendor/remixicon/remixicon.css');
    this.renderer.appendChild(this.document.head, remixiconLink);
  }

  /**
   * تحميل ملفات JavaScript اللازمة
   */
  private loadScripts(): void {
    // Bootstrap JS
    const bootstrapScript = this.renderer.createElement('script');
    this.renderer.setAttribute(bootstrapScript, 'src', 'assets/admin/vendor/bootstrap/js/bootstrap.bundle.min.js');
    this.renderer.appendChild(this.document.body, bootstrapScript);

    // ApexCharts
    const apexchartsScript = this.renderer.createElement('script');
    this.renderer.setAttribute(apexchartsScript, 'src', 'assets/admin/vendor/apexcharts/apexcharts.min.js');
    this.renderer.appendChild(this.document.body, apexchartsScript);

    // Chart.js
    const chartjsScript = this.renderer.createElement('script');
    this.renderer.setAttribute(chartjsScript, 'src', 'assets/admin/vendor/chart.js/chart.umd.js');
    this.renderer.appendChild(this.document.body, chartjsScript);

    // ECharts
    const echartsScript = this.renderer.createElement('script');
    this.renderer.setAttribute(echartsScript, 'src', 'assets/admin/vendor/echarts/echarts.min.js');
    this.renderer.appendChild(this.document.body, echartsScript);

    // Simple DataTables
    const datatablesScript = this.renderer.createElement('script');
    this.renderer.setAttribute(datatablesScript, 'src', 'assets/admin/vendor/simple-datatables/simple-datatables.js');
    this.renderer.appendChild(this.document.body, datatablesScript);

    // TinyMCE
    const tinymceScript = this.renderer.createElement('script');
    this.renderer.setAttribute(tinymceScript, 'src', 'assets/admin/vendor/tinymce/tinymce.min.js');
    this.renderer.appendChild(this.document.body, tinymceScript);

    // Main JS
    const mainScript = this.renderer.createElement('script');
    this.renderer.setAttribute(mainScript, 'src', 'assets/admin/js/main.js');
    this.renderer.appendChild(this.document.body, mainScript);
  }
}
