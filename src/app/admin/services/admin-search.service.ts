import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SearchResult {
  id: string | number;
  title: string;
  description: string;
  type: 'product' | 'order' | 'customer' | 'setting' | 'category';
  url: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminSearchService {
  private searchResultsSubject = new BehaviorSubject<SearchResult[]>([]);
  private isSearchVisibleSubject = new BehaviorSubject<boolean>(false);

  // بيانات مؤقتة للبحث (ستستبدل بالبيانات الفعلية من API)
  private mockData: SearchResult[] = [
    {
      id: 1,
      title: 'هاتف ذكي',
      description: 'منتج - متوفر في المخزون',
      type: 'product',
      url: '/admin/products/1',
      icon: 'bi-box'
    },
    {
      id: 2,
      title: 'لابتوب',
      description: 'منتج - متوفر في المخزون',
      type: 'product',
      url: '/admin/products/2',
      icon: 'bi-box'
    },
    {
      id: 3,
      title: 'سماعات لاسلكية',
      description: 'منتج - متوفر في المخزون',
      type: 'product',
      url: '/admin/products/3',
      icon: 'bi-box'
    },
    {
      id: 2457,
      title: 'طلب #2457',
      description: 'طلب - قيد المعالجة',
      type: 'order',
      url: '/admin/orders/2457',
      icon: 'bi-cart'
    },
    {
      id: 2391,
      title: 'طلب #2391',
      description: 'طلب - تم التسليم',
      type: 'order',
      url: '/admin/orders/2391',
      icon: 'bi-cart'
    },
    {
      id: 101,
      title: 'أحمد محمد',
      description: 'عميل - عضو منذ 2023',
      type: 'customer',
      url: '/admin/customers/101',
      icon: 'bi-person'
    },
    {
      id: 102,
      title: 'سارة أحمد',
      description: 'عميل - عضو منذ 2023',
      type: 'customer',
      url: '/admin/customers/102',
      icon: 'bi-person'
    },
    {
      id: 1,
      title: 'إلكترونيات',
      description: 'تصنيف - 15 منتج',
      type: 'category',
      url: '/admin/categories/1',
      icon: 'bi-folder'
    },
    {
      id: 2,
      title: 'ملابس',
      description: 'تصنيف - 25 منتج',
      type: 'category',
      url: '/admin/categories/2',
      icon: 'bi-folder'
    },
    {
      id: 1,
      title: 'إعدادات الشحن',
      description: 'إعدادات - آخر تحديث: اليوم',
      type: 'setting',
      url: '/admin/settings/shipping',
      icon: 'bi-gear'
    }
  ];

  constructor() { }

  /**
   * البحث في البيانات
   * @param query نص البحث
   */
  search(query: string): void {
    console.log('Searching for:', query); // للتأكد من استدعاء الدالة

    if (!query || query.trim() === '') {
      this.searchResultsSubject.next([]);
      return;
    }

    // تحويل النص إلى حروف صغيرة للمقارنة
    const searchText = query.toLowerCase().trim();

    // البحث في البيانات المؤقتة
    const results = this.mockData.filter(item =>
      item.title.toLowerCase().includes(searchText) ||
      item.description.toLowerCase().includes(searchText)
    );

    console.log('Search results:', results); // للتأكد من النتائج
    this.searchResultsSubject.next(results);
  }

  /**
   * الحصول على نتائج البحث
   */
  getSearchResults(): Observable<SearchResult[]> {
    return this.searchResultsSubject.asObservable();
  }

  /**
   * تبديل حالة ظهور شريط البحث
   */
  toggleSearchVisibility(): void {
    this.isSearchVisibleSubject.next(!this.isSearchVisibleSubject.getValue());
  }

  /**
   * تعيين حالة ظهور شريط البحث
   */
  setSearchVisibility(isVisible: boolean): void {
    this.isSearchVisibleSubject.next(isVisible);
  }

  /**
   * الحصول على حالة ظهور شريط البحث
   */
  getSearchVisibility(): Observable<boolean> {
    return this.isSearchVisibleSubject.asObservable();
  }

  /**
   * مسح نتائج البحث
   */
  clearSearchResults(): void {
    this.searchResultsSubject.next([]);
  }
}
