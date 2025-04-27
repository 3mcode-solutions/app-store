import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageService, Page } from '../../shared/services/page.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  pageTitle = {
    title: 'من نحن',
    description: 'تعرف على شركتنا، رسالتنا، والتزامنا بتقديم خدمات وحلول استثنائية.'
  };

  pageData: Page | null = null;
  isLoading = true;
  error = false;

  constructor(private pageService: PageService) {}

  ngOnInit(): void {
    this.loadPageData();
  }

  loadPageData(): void {
    this.isLoading = true;
    this.error = false;

    this.pageService.getPageBySlug('about').subscribe({
      next: (page) => {
        this.pageData = page;
        if (page) {
          this.pageTitle.title = page.title;
          this.pageTitle.description = page.metaDescription || '';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading about page:', err);
        this.error = true;
        this.isLoading = false;
      }
    });
  }
}
