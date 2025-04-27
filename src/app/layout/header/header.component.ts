import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../shared/services/cart.service';
import { WishlistService } from '../../shared/services/wishlist.service';
import { AuthService, User } from '../../shared/services/auth.service';
import { PageService, Page } from '../../shared/services/page.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isSearchOpen = false;
  isDropdownOpen = false;
  isUserDropdownOpen = false;
  cartItemsCount$!: Observable<number>;
  searchQuery: string = '';
  isAuthenticated = false;
  currentUser: User | null = null;

  // تتبع تمرير الصفحة لتغيير مظهر الهيدر
  isScrolled = false;

  // الصفحات الديناميكية
  dynamicPages: Page[] = [];

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private pageService: PageService
  ) {}

  ngOnInit(): void {
    this.cartItemsCount$ = this.cartService.getCartCount();

    // التحقق من حالة المصادقة
    this.checkAuthStatus();

    // الاشتراك في تغييرات حالة المصادقة
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        this.currentUser = this.authService.getCurrentUserValue();
      } else {
        this.currentUser = null;
      }
    });

    // تحميل الصفحات الديناميكية
    this.loadDynamicPages();
  }

  /**
   * تحميل الصفحات الديناميكية
   */
  loadDynamicPages(): void {
    this.pageService.getAllPages().subscribe({
      next: (pages) => {
        // تصفية الصفحات النشطة فقط
        this.dynamicPages = pages.filter(page => page.isActive);
      },
      error: (err) => {
        console.error('Error loading dynamic pages:', err);
      }
    });
  }

  /**
   * التحقق من حالة المصادقة الحالية
   */
  checkAuthStatus(): void {
    this.isAuthenticated = this.authService.hasUser();
    if (this.isAuthenticated) {
      this.currentUser = this.authService.getCurrentUserValue();
    }
  }

  /**
   * تسجيل الخروج
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * فتح/إغلاق قائمة المستخدم
   */
  toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  // تتبع تمرير الصفحة
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 100;
  }

  // إغلاق القائمة المنسدلة عند النقر خارجها
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown && !userDropdown.contains(event.target as Node) && this.isUserDropdownOpen) {
      this.isUserDropdownOpen = false;
    }
  }

  // فتح/إغلاق القائمة المتنقلة
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    // إغلاق البحث عند فتح القائمة
    if (this.isMenuOpen && this.isSearchOpen) {
      this.isSearchOpen = false;
    }
  }

  // فتح/إغلاق شريط البحث
  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;

    // إغلاق القائمة عند فتح البحث
    if (this.isSearchOpen && this.isMenuOpen) {
      this.isMenuOpen = false;
    }

    // التركيز على حقل البحث عند فتحه
    if (this.isSearchOpen) {
      setTimeout(() => {
        const searchInput = document.querySelector('.search-form input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  }

  // البحث عن المنتجات
  searchProducts() {
    if (this.searchQuery.trim()) {
      // يمكن إضافة منطق البحث هنا
      console.log('البحث عن:', this.searchQuery);

      // إغلاق شريط البحث بعد الإرسال
      this.isSearchOpen = false;
    }
  }

  // فتح/إغلاق القائمة المنسدلة
  toggleDropdown(event: Event) {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
