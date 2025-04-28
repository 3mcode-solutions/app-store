import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Category } from '../../shared/interfaces/category.interface';
import { CategoryService } from '../../shared/services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  parentCategories: Category[] = [];
  isLoading = true;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // تحميل التصنيفات الرئيسية فقط
    this.categoryService.getParentCategories().subscribe({
      next: (categories) => {
        this.parentCategories = categories;
        this.categories = categories;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading = false;
      }
    });
  }

  navigateToProducts(categoryId: number): void {
    this.categoryService.setSelectedCategory(categoryId.toString());
    this.router.navigate(['/products'], {
      queryParams: { category: categoryId }
    });
  }

  /**
   * التنقل إلى صفحة المنتجات باستخدام الرابط المختصر
   */
  navigateToProductsBySlug(slug: string): void {
    this.router.navigate(['/products'], {
      queryParams: { categorySlug: slug }
    });
  }
}
