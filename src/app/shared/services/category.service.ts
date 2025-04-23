import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private selectedCategoryId = new BehaviorSubject<number | null>(null);

  private categories: Category[] = [
    {
      id: 1,
      name: 'إلكترونيات',
      description: 'هواتف ذكية، أجهزة لوحية، لابتوب وإكسسوارات',
      imageUrl: 'assets/img/categories/electronics.jpg',
      productCount: 150,
      icon: 'bi bi-phone'
    },
    {
      id: 2,
      name: 'ملابس',
      description: 'ملابس رجالية ونسائية وأطفال',
      imageUrl: 'assets/img/categories/fashion.jpg',
      productCount: 300,
      icon: 'bi bi-bag'
    },
    // ... باقي التصنيفات
  ];

  getCategories(): Category[] {
    return this.categories;
  }

  setSelectedCategory(categoryId: number): void {
    this.selectedCategoryId.next(categoryId);
  }

  getSelectedCategory(): Observable<number | null> {
    return this.selectedCategoryId.asObservable();
  }

  getCategoryById(id: number): Category | undefined {
    return this.categories.find(category => category.id === id);
  }
}
