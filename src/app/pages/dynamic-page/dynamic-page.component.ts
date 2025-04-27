import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PageService, Page } from '../../shared/services/page.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dynamic-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './dynamic-page.component.html',
  styleUrls: ['./dynamic-page.component.css']
})
export class DynamicPageComponent implements OnInit {
  pageTitle = {
    title: 'جاري التحميل...',
    description: ''
  };

  pageData: Page | null = null;
  isLoading = true;
  error = false;
  slug: string = '';

  constructor(
    private pageService: PageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // استخراج معرف الصفحة من المسار
    this.route.params.subscribe(params => {
      this.slug = params['slug'];
      this.loadPageData();
    });
  }

  loadPageData(): void {
    this.isLoading = true;
    this.error = false;

    this.pageService.getPageBySlug(this.slug).subscribe({
      next: (page) => {
        if (page) {
          this.pageData = page;
          this.pageTitle.title = page.title;
          this.pageTitle.description = page.metaDescription || '';
          this.isLoading = false;
        } else {
          // إذا لم يتم العثور على الصفحة، انتقل إلى الصفحة الرئيسية
          this.error = true;
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error(`Error loading page with slug ${this.slug}:`, err);
        this.error = true;
        this.isLoading = false;
      }
    });
  }
}
