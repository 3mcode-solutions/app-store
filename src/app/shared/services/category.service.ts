import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Category } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private selectedCategoryId = new BehaviorSubject<string | null>(null);

  private categories: Category[] = [
    {
      id: 1,
      name: 'إلكترونيات',
      description: 'هواتف ذكية، أجهزة لوحية، لابتوب وإكسسوارات',
      imageUrl: 'assets/img/categories/electronics.jpg',
      productCount: 150,
      icon: 'bi bi-phone',
      isActive: true
    },
    {
      id: 2,
      name: 'ملابس',
      description: 'ملابس رجالية ونسائية وأطفال',
      imageUrl: 'assets/img/categories/fashion.jpg',
      productCount: 300,
      icon: 'bi bi-bag',
      isActive: true
    },
    {
      id: 3,
      name: 'أثاث منزلي',
      description: 'أثاث للمنزل والمكتب',
      imageUrl: 'assets/img/categories/furniture.jpg',
      productCount: 120,
      icon: 'bi bi-house',
      isActive: true
    },
    {
      id: 4,
      name: 'مستلزمات رياضية',
      description: 'معدات وملابس رياضية',
      imageUrl: 'assets/img/categories/sports.jpg',
      productCount: 80,
      icon: 'bi bi-bicycle',
      isActive: true
    },
    {
      id: 5,
      name: 'كتب',
      description: 'كتب ورقية وإلكترونية',
      imageUrl: 'assets/img/categories/books.jpg',
      productCount: 200,
      icon: 'bi bi-book',
      isActive: true
    },
    {
      id: 6,
      name: 'مستلزمات منزلية',
      description: 'أدوات ومستلزمات للمنزل',
      imageUrl: 'assets/img/categories/home.jpg',
      productCount: 180,
      icon: 'bi bi-house-door',
      isActive: true
    }
  ];

  /**
   * الحصول على جميع الفئات
   */
  getCategories(): Observable<Category[]> {
    return of([...this.categories]).pipe(delay(300));
  }

  /**
   * تعيين الفئة المحددة
   */
  setSelectedCategory(categoryId: string): void {
    this.selectedCategoryId.next(categoryId);
  }

  /**
   * الحصول على الفئة المحددة
   */
  getSelectedCategory(): Observable<string | null> {
    return this.selectedCategoryId.asObservable();
  }

  /**
   * الحصول على فئة بواسطة المعرف
   */
  getCategoryById(id: number): Observable<Category | undefined> {
    const category = this.categories.find(category => category.id === id);
    return of(category).pipe(delay(200));
  }

  /**
   * إضافة فئة جديدة
   */
  addCategory(category: Category): Observable<Category> {
    // إنشاء معرف جديد
    const newId = Math.max(...this.categories.map(c => c.id)) + 1;
    const newCategory = { ...category, id: newId };

    // إضافة الفئة إلى المصفوفة
    this.categories.push(newCategory);

    return of(newCategory).pipe(delay(500));
  }

  /**
   * تحديث فئة موجودة
   */
  updateCategory(category: Category): Observable<Category> {
    // البحث عن الفئة وتحديثها
    const index = this.categories.findIndex(c => c.id === category.id);

    if (index !== -1) {
      this.categories[index] = { ...category };
      return of(this.categories[index]).pipe(delay(500));
    }

    // إذا لم يتم العثور على الفئة
    return of(category).pipe(delay(500));
  }

  /**
   * حذف فئة
   */
  deleteCategory(id: number): Observable<boolean> {
    const initialLength = this.categories.length;
    this.categories = this.categories.filter(c => c.id !== id);

    // التحقق من نجاح الحذف
    const success = initialLength > this.categories.length;

    return of(success).pipe(delay(500));
  }
}
