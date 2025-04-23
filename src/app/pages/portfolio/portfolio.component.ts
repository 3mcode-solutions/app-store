import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent {
  pageTitle = {
    title: 'Portfolio',
    description: 'Check our latest work and success stories that showcase our expertise and commitment to excellence.'
  };

  categories = ['All', 'Web', 'Mobile', 'Design', 'Branding'];
  activeCategory = 'All';

  portfolioItems = [
    {
      id: 1,
      title: 'Modern Web Application',
      category: 'Web',
      image: 'assets/img/portfolio/web-1.jpg',
      description: 'A modern web application built with the latest technologies.',
      client: 'Tech Corp',
      date: '2024-01-15',
      url: 'https://example.com',
      delay: 100
    },
    {
      id: 2,
      title: 'Mobile App Design',
      category: 'Mobile',
      image: 'assets/img/portfolio/mobile-1.jpg',
      description: 'Innovative mobile app design for enhanced user experience.',
      client: 'Mobile Solutions',
      date: '2024-02-20',
      url: 'https://example.com',
      delay: 200
    },
    {
      id: 3,
      title: 'Brand Identity',
      category: 'Branding',
      image: 'assets/img/portfolio/brand-1.jpg',
      description: 'Complete brand identity design for a growing company.',
      client: 'Brand Co',
      date: '2024-03-10',
      url: 'https://example.com',
      delay: 300
    },
    {
      id: 4,
      title: 'UI/UX Design System',
      category: 'Design',
      image: 'assets/img/portfolio/design-1.jpg',
      description: 'Comprehensive UI/UX design system for enterprise applications.',
      client: 'Design Studio',
      date: '2024-03-25',
      url: 'https://example.com',
      delay: 400
    }
  ];

  setActiveCategory(category: string) {
    this.activeCategory = category;
  }

  get filteredItems() {
    return this.activeCategory === 'All'
      ? this.portfolioItems
      : this.portfolioItems.filter(item => item.category === this.activeCategory);
  }
}
