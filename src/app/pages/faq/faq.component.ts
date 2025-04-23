import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
  pageTitle = {
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about our services and solutions.'
  };

  categories = [
    {
      title: 'General Questions',
      faqs: [
        {
          question: 'What services do you offer?',
          answer: 'We offer a comprehensive range of digital services including web development, mobile app development, UI/UX design, and digital marketing solutions.',
          isOpen: false
        },
        {
          question: 'How can I get started with your services?',
          answer: 'Getting started is easy! Simply contact us through our contact form or give us a call. We\'ll schedule a consultation to discuss your needs and create a tailored solution.',
          isOpen: false
        },
        {
          question: 'Do you provide support after project completion?',
          answer: 'Yes, we provide ongoing support and maintenance services to ensure your solution continues to perform optimally.',
          isOpen: false
        }
      ]
    },
    {
      title: 'Technical Questions',
      faqs: [
        {
          question: 'Which technologies do you use?',
          answer: 'We use the latest technologies including Angular, React, Node.js, Python, and various cloud platforms to deliver modern and scalable solutions.',
          isOpen: false
        },
        {
          question: 'How do you ensure project quality?',
          answer: 'We follow industry best practices, implement rigorous testing procedures, and maintain continuous communication throughout the development process.',
          isOpen: false
        },
        {
          question: 'Can you help with existing projects?',
          answer: 'Yes, we can help maintain, upgrade, or enhance your existing projects using our technical expertise.',
          isOpen: false
        }
      ]
    },
    {
      title: 'Pricing & Plans',
      faqs: [
        {
          question: 'What are your pricing models?',
          answer: 'We offer flexible pricing models including fixed-price projects, time and materials, and retainer agreements to suit different needs and budgets.',
          isOpen: false
        },
        {
          question: 'Do you offer custom packages?',
          answer: 'Yes, we create custom packages tailored to your specific requirements and business goals.',
          isOpen: false
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept various payment methods including credit cards, bank transfers, and digital payments.',
          isOpen: false
        }
      ]
    }
  ];

  toggleFaq(category: any, faq: any) {
    faq.isOpen = !faq.isOpen;
    // Close other FAQs in the same category
    category.faqs.forEach((f: any) => {
      if (f !== faq) {
        f.isOpen = false;
      }
    });
  }
}
