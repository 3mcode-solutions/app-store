import { Component, OnInit, Renderer2, Inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSearchService, SearchResult } from '../services/admin-search.service';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { NotificationService, Notification } from '../../shared/services/notification.service';
import { MessageService, Message } from '../../shared/services/message.service';
import { ThemeService, ThemeType } from '../../shared/services/theme.service';
import { ToastTestComponent } from '../../shared/components/toast-test/toast-test.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ToastTestComponent],
  templateUrl: './admin-layout.component.html',
  styleUrls: [
    './admin-layout.component.css',
    '../../../assets/admin/css/style.css'
  ]
})
export class AdminLayoutComponent implements OnInit {
  // متغيرات البحث
  searchQuery: string = '';
  searchResults: SearchResult[] = [];
  isSearchVisible: boolean = false;

  // متغيرات القوائم المنسدلة
  isNotificationsOpen: boolean = false;
  isMessagesOpen: boolean = false;
  isProfileOpen: boolean = false;

  // متغيرات الإشعارات
  notifications: Notification[] = [];
  unreadNotificationsCount: number = 0;

  // متغيرات الرسائل
  messages: Message[] = [];
  unreadMessagesCount: number = 0;

  // متغيرات السمة
  currentTheme: ThemeType = 'light';

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private searchService: AdminSearchService,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private messageService: MessageService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    // تهيئة المكون عند التحميل
    document.body.classList.add('admin-panel');

    // استرجاع حالة الشريط الجانبي من التخزين المحلي
    const sidebarToggled = localStorage.getItem('sidebar-toggle') === 'true';
    if (sidebarToggled) {
      document.body.classList.add('toggle-sidebar');
    }

    // تحميل ملفات CSS و JS الخاصة بقالب NiceAdmin
    this.loadAdminStyles();
    this.initializeAdminScripts();

    // الاشتراك في تغييرات نتائج البحث
    this.searchService.getSearchResults().subscribe(results => {
      this.searchResults = results;
    });

    // الاشتراك في تغييرات حالة ظهور شريط البحث
    this.searchService.getSearchVisibility().subscribe(isVisible => {
      this.isSearchVisible = isVisible;

      // إضافة/إزالة فئة CSS لإظهار/إخفاء شريط البحث
      const searchBar = this.document.querySelector('.search-bar');
      if (searchBar) {
        if (isVisible) {
          searchBar.classList.add('search-bar-show');
        } else {
          searchBar.classList.remove('search-bar-show');
        }
      }
    });

    // الاشتراك في تغييرات الإشعارات
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
    });

    // الاشتراك في تغييرات عدد الإشعارات غير المقروءة
    this.notificationService.getUnreadCount().subscribe(count => {
      this.unreadNotificationsCount = count;
    });

    // الاشتراك في تغييرات الرسائل
    this.messageService.getMessages().subscribe(messages => {
      this.messages = messages;
    });

    // الاشتراك في تغييرات عدد الرسائل غير المقروءة
    this.messageService.getUnreadCount().subscribe(count => {
      this.unreadMessagesCount = count;
    });

    // الاشتراك في تغييرات السمة
    this.themeService.getTheme().subscribe(theme => {
      this.currentTheme = theme;
    });

    // تفعيل القوائم المنسدلة في الشريط الجانبي
    setTimeout(() => {
      this.initSidebarDropdowns();
    }, 1000);
  }

  /**
   * تفعيل القوائم المنسدلة في الشريط الجانبي
   */
  private initSidebarDropdowns(): void {
    // الحصول على جميع روابط القوائم المنسدلة
    const dropdownLinks = this.document.querySelectorAll('.sidebar-nav .nav-link.collapsed');

    // إضافة مستمع أحداث لكل رابط
    dropdownLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        // الحصول على الهدف من السمة data-bs-target
        const target = (link as HTMLElement).getAttribute('data-bs-target');
        if (target) {
          // الحصول على عنصر القائمة المنسدلة
          const dropdown = this.document.querySelector(target);
          if (dropdown) {
            // تبديل فئة collapse
            dropdown.classList.toggle('collapse');
            dropdown.classList.toggle('show');

            // تبديل فئة collapsed للرابط
            link.classList.toggle('collapsed');
          }
        }
      });
    });

    console.log('Sidebar dropdowns initialized');
  }

  /**
   * تبديل حالة الشريط الجانبي
   */
  toggleSidebar(): void {
    // إضافة/إزالة فئة toggle-sidebar من عنصر body
    document.body.classList.toggle('toggle-sidebar');

    // حفظ حالة الشريط الجانبي في التخزين المحلي
    const isSidebarToggled = document.body.classList.contains('toggle-sidebar');
    localStorage.setItem('sidebar-toggle', isSidebarToggled ? 'true' : 'false');

    // تحديث حالة الشريط الجانبي في جميع المكونات
    const event = new CustomEvent('sidebar-toggle', { detail: { toggled: isSidebarToggled } });
    window.dispatchEvent(event);
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
      // إضافة سكربتات Bootstrap أولاً
      const bootstrapScript = this.renderer.createElement('script');
      this.renderer.setAttribute(bootstrapScript, 'src', 'assets/admin/vendor/bootstrap/js/bootstrap.bundle.min.js');
      this.renderer.appendChild(this.document.body, bootstrapScript);

      // ثم إضافة سكربت ApexCharts
      const apexChartsScript = this.renderer.createElement('script');
      this.renderer.setAttribute(apexChartsScript, 'src', 'assets/admin/vendor/apexcharts/apexcharts.min.js');
      this.renderer.appendChild(this.document.body, apexChartsScript);

      // ثم إضافة سكربت Chart.js
      const chartJsScript = this.renderer.createElement('script');
      this.renderer.setAttribute(chartJsScript, 'src', 'assets/admin/vendor/chart.js/chart.umd.js');
      this.renderer.appendChild(this.document.body, chartJsScript);

      // إضافة سكربت main.js
      const mainScript = this.renderer.createElement('script');
      this.renderer.setAttribute(mainScript, 'src', 'assets/admin/js/main.js');
      this.renderer.appendChild(this.document.body, mainScript);

      // إضافة سكربت مخصص للوحة التحكم
      const customScript = this.renderer.createElement('script');
      this.renderer.setAttribute(customScript, 'src', 'assets/admin/js/custom-admin.js');
      this.renderer.appendChild(this.document.body, customScript);

      // تنفيذ الكود الخاص بتهيئة لوحة التحكم مباشرة
      this.initializeToggleSidebar();
    }, 1000);
  }

  /**
   * تهيئة زر تبديل الشريط الجانبي
   */
  private initializeToggleSidebar(): void {
    // تهيئة زر تبديل الشريط الجانبي يدوياً
    const toggleBtn = this.document.querySelector('.toggle-sidebar-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.document.body.classList.toggle('toggle-sidebar');
      });
    }

    // تهيئة زر البحث في الشاشات الصغيرة
    const searchToggleBtn = this.document.querySelector('.search-bar-toggle');
    if (searchToggleBtn) {
      searchToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleSearch();
      });
    }
  }

  /**
   * تبديل حالة ظهور شريط البحث
   */
  toggleSearch(): void {
    // تبديل حالة ظهور شريط البحث
    this.isSearchVisible = !this.isSearchVisible;
    this.searchService.setSearchVisibility(this.isSearchVisible);

    console.log('Search visibility toggled:', this.isSearchVisible);

    // التركيز على حقل البحث عند فتحه
    if (this.isSearchVisible) {
      // مسح نتائج البحث السابقة
      this.searchResults = [];
      this.searchQuery = '';

      setTimeout(() => {
        const searchInput = this.document.querySelector('.search-form input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          console.log('Focus set on search input');
        }
      }, 300);
    }
  }

  /**
   * البحث في البيانات
   */
  search(): void {
    console.log('Search triggered with query:', this.searchQuery); // للتأكد من استدعاء الدالة
    this.searchService.search(this.searchQuery);
  }

  /**
   * الانتقال إلى نتيجة البحث
   */
  goToSearchResult(result: SearchResult): void {
    // الانتقال إلى الصفحة المطلوبة
    this.router.navigateByUrl(result.url);

    // إغلاق شريط البحث ومسح النتائج
    this.searchService.setSearchVisibility(false);
    this.searchService.clearSearchResults();
    this.searchQuery = '';
    this.isSearchVisible = false;
  }

  /**
   * إغلاق شريط البحث عند النقر خارجه
   */
  /**
   * تبديل حالة قائمة الإشعارات
   */
  toggleNotifications(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    // إغلاق القوائم الأخرى
    this.isMessagesOpen = false;
    this.isProfileOpen = false;

    // تبديل حالة قائمة الإشعارات
    this.isNotificationsOpen = !this.isNotificationsOpen;
  }

  /**
   * تعيين إشعار كمقروء
   */
  markNotificationAsRead(id: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.notificationService.markAsRead(id);
  }

  /**
   * تعيين جميع الإشعارات كمقروءة
   */
  markAllNotificationsAsRead(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.notificationService.markAllAsRead();
  }

  /**
   * تحويل التاريخ إلى نص يوضح الوقت المنقضي
   */
  getTimeAgo(date: Date): string {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) {
      return 'منذ لحظات';
    } else if (diffMin < 60) {
      return `منذ ${diffMin} دقيقة`;
    } else if (diffHour < 24) {
      return `منذ ${diffHour} ساعة`;
    } else if (diffDay < 30) {
      return `منذ ${diffDay} يوم`;
    } else {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }

  /**
   * تبديل حالة قائمة الرسائل
   */
  toggleMessages(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    // إغلاق القوائم الأخرى
    this.isNotificationsOpen = false;
    this.isProfileOpen = false;

    // تبديل حالة قائمة الرسائل
    this.isMessagesOpen = !this.isMessagesOpen;
  }

  /**
   * تعيين رسالة كمقروءة
   */
  markMessageAsRead(id: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.messageService.markAsRead(id);
  }

  /**
   * تعيين جميع الرسائل كمقروءة
   */
  markAllMessagesAsRead(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.messageService.markAllAsRead();
  }

  /**
   * تبديل حالة قائمة الملف الشخصي
   */
  toggleProfile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    // إغلاق القوائم الأخرى
    this.isNotificationsOpen = false;
    this.isMessagesOpen = false;

    // تبديل حالة قائمة الملف الشخصي
    this.isProfileOpen = !this.isProfileOpen;
  }

  /**
   * تسجيل الخروج
   */
  logout(event: Event): void {
    event.preventDefault();
    console.log('Logging out...');

    // استدعاء خدمة المصادقة لتسجيل الخروج
    this.authService.logout();

    // إغلاق القائمة المنسدلة
    this.isProfileOpen = false;
  }

  /**
   * تبديل السمة
   */
  toggleTheme(event: Event): void {
    event.preventDefault();

    // تبديل السمة
    const newTheme: ThemeType = this.currentTheme === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(newTheme);

    // إغلاق القائمة المنسدلة
    this.isProfileOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // التحقق مما إذا كان النقر خارج العناصر المفتوحة

    // التحقق من شريط البحث
    if (this.isSearchVisible) {
      const searchBar = this.document.querySelector('.search-bar');
      const searchToggle = this.document.querySelector('.search-bar-toggle');
      const desktopSearchToggle = this.document.querySelector('.nav-item.d-none.d-lg-block .nav-link');

      if (searchBar && !searchBar.contains(event.target as Node) &&
          searchToggle && !searchToggle.contains(event.target as Node) &&
          desktopSearchToggle && !desktopSearchToggle.contains(event.target as Node)) {
        console.log('Clicked outside search bar, closing it');
        this.isSearchVisible = false;
        this.searchService.setSearchVisibility(false);
      }
    }

    // التحقق من قائمة الإشعارات
    if (this.isNotificationsOpen) {
      const notificationsMenu = this.document.querySelector('.notifications');
      const notificationsToggle = this.document.querySelector('.nav-link[data-notifications]');

      if (notificationsMenu && !notificationsMenu.contains(event.target as Node) &&
          notificationsToggle && !notificationsToggle.contains(event.target as Node)) {
        this.isNotificationsOpen = false;
      }
    }

    // التحقق من قائمة الرسائل
    if (this.isMessagesOpen) {
      const messagesMenu = this.document.querySelector('.messages');
      const messagesToggle = this.document.querySelector('.nav-link[data-messages]');

      if (messagesMenu && !messagesMenu.contains(event.target as Node) &&
          messagesToggle && !messagesToggle.contains(event.target as Node)) {
        this.isMessagesOpen = false;
      }
    }

    // التحقق من قائمة الملف الشخصي
    if (this.isProfileOpen) {
      const profileMenu = this.document.querySelector('.profile');
      const profileToggle = this.document.querySelector('.nav-link.nav-profile');

      if (profileMenu && !profileMenu.contains(event.target as Node) &&
          profileToggle && !profileToggle.contains(event.target as Node)) {
        this.isProfileOpen = false;
      }
    }
  }
}
