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

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  navigateToProducts(categoryId: number): void {
    this.categoryService.setSelectedCategory(categoryId.toString());
    this.router.navigate(['/products'], {
      queryParams: { category: categoryId }
    });
  }
}
