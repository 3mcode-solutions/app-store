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

  // بيانات وهمية للتصنيفات (لن تستخدم إلا في حالة فشل الاتصال بالـ API)
  private categories: Category[] = [
    {
      id: 1,
      name: 'إلكترونيات',
      description: 'هواتف ذكية، أجهزة لوحية، لابتوب وإكسسوارات',
      imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=600&h=400&auto=format&fit=crop',
      icon: 'bi bi-laptop',
      slug: 'electronics',
      displayOrder: 1,
      isParent: true,
      active: true,
      productCount: 150,
      subCategories: [
        {
          id: 5,
          name: 'هواتف ذكية',
          description: 'هواتف ذكية وملحقاتها',
          imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&h=400&auto=format&fit=crop',
          icon: 'bi bi-phone-fill',
          slug: 'smartphones',
          displayOrder: 1,
          isParent: false,
          parentId: 1,
          active: true,
          productCount: 50
        },
        {
          id: 6,
          name: 'أجهزة لوحية',
          description: 'أجهزة لوحية وملحقاتها',
          imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&h=400&auto=format&fit=crop',
          icon: 'bi bi-tablet',
          slug: 'tablets',
          displayOrder: 2,
          isParent: false,
          parentId: 1,
          active: true,
          productCount: 30
        }
      ]
    },
    {
      id: 2,
      name: 'ملابس',
      description: 'ملابس رجالية ونسائية وأطفال',
      imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600&h=400&auto=format&fit=crop',
      icon: 'bi bi-basket',
      slug: 'clothing',
      displayOrder: 2,
      isParent: true,
      active: true,
      productCount: 300,
      subCategories: [
        {
          id: 7,
          name: 'ملابس رجالية',
          description: 'ملابس وإكسسوارات رجالية',
          imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&h=400&auto=format&fit=crop',
          icon: 'bi bi-person-standing',
          slug: 'men-clothing',
          displayOrder: 1,
          isParent: false,
          parentId: 2,
          active: true,
          productCount: 120
        },
        {
          id: 8,
          name: 'ملابس نسائية',
          description: 'ملابس وإكسسوارات نسائية',
          imageUrl: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=600&h=400&auto=format&fit=crop',
          icon: 'bi bi-person-dress',
          slug: 'women-clothing',
          displayOrder: 2,
          isParent: false,
          parentId: 2,
          active: true,
          productCount: 180
        }
      ]
    },
    {
      id: 3,
      name: 'المنزل والمطبخ',
      description: 'أدوات منزلية وأجهزة مطبخ',
      imageUrl: 'https://images.unsplash.com/photo-1556911220-bda9f7f7597e?q=80&w=600&h=400&auto=format&fit=crop',
      icon: 'bi bi-house-heart',
      slug: 'home-kitchen',
      displayOrder: 3,
      isParent: true,
      active: true,
      productCount: 120,
      subCategories: [
        {
          id: 9,
          name: 'الأثاث',
          description: 'أثاث منزلي ومكتبي',
          imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&h=400&auto=format&fit=crop',
          icon: 'bi bi-lamp-fill',
          slug: 'furniture',
          displayOrder: 1,
          isParent: false,
          parentId: 3,
          active: true,
          productCount: 70
        },
        {
          id: 10,
          name: 'أجهزة المطبخ',
          description: 'أجهزة وأدوات المطبخ',
          imageUrl: 'https://images.unsplash.com/photo-1556909114-44e3e9699e2b?q=80&w=600&h=400&auto=format&fit=crop',
          icon: 'bi bi-cup-hot-fill',
          slug: 'kitchen-appliances',
          displayOrder: 2,
          isParent: false,
          parentId: 3,
          active: true,
          productCount: 50
        }
      ]
    },
    {
      id: 4,
      name: 'كتب',
      description: 'كتب ورقية وإلكترونية',
      imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=600&h=400&auto=format&fit=crop',
      icon: 'bi bi-book-half',
      slug: 'books',
      displayOrder: 4,
      isParent: true,
      active: true,
      productCount: 200,
      subCategories: []
    }
  ];

  /**
   * الحصول على جميع الفئات
   * @param parentOnly إذا كانت true، يتم إرجاع الفئات الرئيسية فقط
   * @param active إذا كانت true، يتم إرجاع الفئات النشطة فقط
   * @param sortBy حقل الترتيب
   * @param sortOrder اتجاه الترتيب (asc أو desc)
   */
  getCategories(parentOnly?: boolean, active?: boolean, sortBy: string = 'displayOrder', sortOrder: string = 'asc'): Observable<Category[]> {
    // بناء عنوان URL مع المعلمات
    let url = 'categories';
    const params: string[] = [];

    if (parentOnly !== undefined) {
      params.push(`parentOnly=${parentOnly}`);
    }

    if (active !== undefined) {
      params.push(`active=${active}`);
    }

    if (sortBy) {
      params.push(`sortBy=${sortBy}`);
    }

    if (sortOrder) {
      params.push(`sortOrder=${sortOrder}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      let filteredCategories = [...this.categories];

      if (parentOnly) {
        filteredCategories = filteredCategories.filter(c => c.isParent);
      }

      if (active !== undefined) {
        filteredCategories = filteredCategories.filter(c => c.active === active);
      }

      return of(filteredCategories).pipe(delay(300));
    }

    // استخدام API حقيقي
    return this.apiService.get<Category[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        let filteredCategories = [...this.categories];

        if (parentOnly) {
          filteredCategories = filteredCategories.filter(c => c.isParent);
        }

        if (active !== undefined) {
          filteredCategories = filteredCategories.filter(c => c.active === active);
        }

        return of(filteredCategories);
      })
    );
  }

  /**
   * الحصول على الفئات الرئيسية فقط
   */
  getParentCategories(): Observable<Category[]> {
    return this.getCategories(true, true);
  }

  /**
   * الحصول على الفئات الفرعية لفئة معينة
   * @param parentId معرف الفئة الرئيسية
   */
  getSubCategories(parentId: number): Observable<Category[]> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const parentCategory = this.categories.find(c => c.id === parentId);
      return of(parentCategory?.subCategories || []).pipe(delay(300));
    }

    // استخدام API حقيقي
    return this.apiService.get<Category[]>(`categories/subcategories/${parentId}`).pipe(
      catchError(error => {
        console.error(`Error fetching subcategories for parent ${parentId}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const parentCategory = this.categories.find(c => c.id === parentId);
        return of(parentCategory?.subCategories || []);
      })
    );
  }

  /**
   * الحصول على فئة بواسطة المعرف
   * @param id معرف الفئة
   */
  getCategoryById(id: number): Observable<Category | null> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const category = this.categories.find(c => c.id === id);
      if (!category) {
        // البحث في الفئات الفرعية
        for (const parent of this.categories) {
          if (parent.subCategories) {
            const subCategory = parent.subCategories.find(sc => sc.id === id);
            if (subCategory) {
              return of(subCategory).pipe(delay(300));
            }
          }
        }
      }
      return of(category || null).pipe(delay(300));
    }

    // استخدام API حقيقي
    return this.apiService.get<Category>(`categories/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching category ${id}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const category = this.categories.find(c => c.id === id);
        if (!category) {
          // البحث في الفئات الفرعية
          for (const parent of this.categories) {
            if (parent.subCategories) {
              const subCategory = parent.subCategories.find(sc => sc.id === id);
              if (subCategory) {
                return of(subCategory);
              }
            }
          }
        }
        return of(category || null);
      })
    );
  }

  /**
   * الحصول على فئة بواسطة الرابط المختصر
   * @param slug الرابط المختصر للفئة
   */
  getCategoryBySlug(slug: string): Observable<Category | null> {
    // في حالة عدم وجود API حقيقي، نستخدم البيانات الوهمية
    if (!environment.production) {
      const category = this.categories.find(c => c.slug === slug);
      if (!category) {
        // البحث في الفئات الفرعية
        for (const parent of this.categories) {
          if (parent.subCategories) {
            const subCategory = parent.subCategories.find(sc => sc.slug === slug);
            if (subCategory) {
              return of(subCategory).pipe(delay(300));
            }
          }
        }
      }
      return of(category || null).pipe(delay(300));
    }

    // استخدام API حقيقي
    return this.apiService.get<Category>(`categories/slug/${slug}`).pipe(
      catchError(error => {
        console.error(`Error fetching category by slug ${slug}:`, error);
        // في حالة حدوث خطأ، نعود إلى البيانات الوهمية
        const category = this.categories.find(c => c.slug === slug);
        if (!category) {
          // البحث في الفئات الفرعية
          for (const parent of this.categories) {
            if (parent.subCategories) {
              const subCategory = parent.subCategories.find(sc => sc.slug === slug);
              if (subCategory) {
                return of(subCategory);
              }
            }
          }
        }
        return of(category || null);
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
