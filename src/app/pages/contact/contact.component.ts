import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PageService, Page } from '../../shared/services/page.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  pageTitle = {
    title: 'اتصل بنا',
    description: 'تواصل معنا لأي استفسارات أو احتياجات دعم.'
  };

  contactInfo = {
    address: 'شارع الملك فهد، الرياض، المملكة العربية السعودية',
    email: 'info@example.com',
    phone: '+966 12 345 6789',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.1832756968327!2d46.6885!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1682237287261!5m2!1sen!2s'
  };

  pageData: Page | null = null;
  isPageLoading = true;
  pageError = false;

  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isLoading = false;
  isError = false;
  isSuccess = false;
  errorMessage = '';

  constructor(private pageService: PageService) {}

  ngOnInit(): void {
    this.loadPageData();
  }

  loadPageData(): void {
    this.isPageLoading = true;
    this.pageError = false;

    this.pageService.getPageBySlug('contact').subscribe({
      next: (page) => {
        this.pageData = page;
        if (page) {
          this.pageTitle.title = page.title;
          this.pageTitle.description = page.metaDescription || '';
        }
        this.isPageLoading = false;
      },
      error: (err) => {
        console.error('Error loading contact page:', err);
        this.pageError = true;
        this.isPageLoading = false;
      }
    });
  }

  async onSubmit() {
    if (!this.formData.name || !this.formData.email || !this.formData.subject || !this.formData.message) {
      this.isError = true;
      this.errorMessage = 'يرجى ملء جميع الحقول';
      return;
    }

    this.isLoading = true;
    this.isError = false;
    this.isSuccess = false;
    this.errorMessage = '';

    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Form submitted:', this.formData);
      this.isSuccess = true;

      // Reset form after successful submission
      this.formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
    } catch (error) {
      this.isError = true;
      this.errorMessage = 'حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى.';
    } finally {
      this.isLoading = false;
    }
  }
}
