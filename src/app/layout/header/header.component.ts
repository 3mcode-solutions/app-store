import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../shared/services/cart.service';
import { WishlistService } from '../../shared/services/wishlist.service';
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
  cartItemsCount$!: Observable<number>;
  searchQuery: string = '';

  // تتبع تمرير الصفحة لتغيير مظهر الهيدر
  isScrolled = false;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.cartItemsCount$ = this.cartService.getCartCount();
  }

  // تتبع تمرير الصفحة
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 100;
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
