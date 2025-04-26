import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, catchError, tap, map } from 'rxjs/operators';
import { Category } from '../interfaces/category.interface';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private selectedCategoryId = new BehaviorSubject<string | null>(null);

  constructor(private apiService: ApiService) { }

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
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      return of([...this.categories]).pipe(delay(300));
    }

    // استخدام API حقيقي
    return this.apiService.get<Category[]>('categories').pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        return of([...this.categories]);
      })
    );
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
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const category = this.categories.find(category => category.id === id);
      return of(category).pipe(delay(200));
    }

    // استخدام API حقيقي
    return this.apiService.get<Category>(`categories/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching category with id ${id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const category = this.categories.find(category => category.id === id);
        return of(category);
      })
    );
  }

  /**
   * إضافة فئة جديدة
   */
  addCategory(category: Category): Observable<Category> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      // إنشاء معرف جديد
      const newId = Math.max(...this.categories.map(c => c.id)) + 1;
      const newCategory = { ...category, id: newId };

      // إضافة الفئة إلى المصفوفة
      this.categories.push(newCategory);

      return of(newCategory).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.post<Category>('categories', category).pipe(
      tap(newCategory => {
        // إضافة الفئة الجديدة إلى الذاكرة المؤقتة
        this.categories.push(newCategory);
      }),
      catchError(error => {
        console.error('Error adding category:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const newId = Math.max(...this.categories.map(c => c.id)) + 1;
        const newCategory = { ...category, id: newId };
        this.categories.push(newCategory);
        return of(newCategory);
      })
    );
  }

  /**
   * تحديث فئة موجودة
   */
  updateCategory(category: Category): Observable<Category> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      // البحث عن الفئة وتحديثها
      const index = this.categories.findIndex(c => c.id === category.id);

      if (index !== -1) {
        this.categories[index] = { ...category };
        return of(this.categories[index]).pipe(delay(500));
      }

      // إذا لم يتم العثور على الفئة
      return of(category).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.put<Category>(`categories/${category.id}`, category).pipe(
      tap(updatedCategory => {
        // تحديث الفئة في الذاكرة المؤقتة
        const index = this.categories.findIndex(c => c.id === updatedCategory.id);
        if (index !== -1) {
          this.categories[index] = updatedCategory;
        }
      }),
      catchError(error => {
        console.error(`Error updating category with id ${category.id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const index = this.categories.findIndex(c => c.id === category.id);
        if (index !== -1) {
          this.categories[index] = { ...category };
          return of(this.categories[index]);
        }
        return of(category);
      })
    );
  }

  /**
   * حذف فئة
   */
  deleteCategory(id: number): Observable<boolean> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const initialLength = this.categories.length;
      this.categories = this.categories.filter(c => c.id !== id);

      // التحقق من نجاح الحذف
      const success = initialLength > this.categories.length;

      return of(success).pipe(delay(500));
    }

    // استخدام API حقيقي
    return this.apiService.delete<any>(`categories/${id}`).pipe(
      map(() => {
        // حذف الفئة من الذاكرة المؤقتة
        this.categories = this.categories.filter(c => c.id !== id);
        return true;
      }),
      catchError(error => {
        console.error(`Error deleting category with id ${id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        return of(false);
      })
    );
  }
}
