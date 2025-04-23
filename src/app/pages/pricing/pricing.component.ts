import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent {
  pageTitle = {
    title: 'Pricing Plans',
    description: 'Choose the perfect plan for your needs. Get started with our flexible pricing options.'
  };

  plans = [
    {
      name: 'Basic',
      price: 29,
      period: 'month',
      features: [
        { text: '5 Projects', available: true },
        { text: '10GB Storage', available: true },
        { text: 'Basic Support', available: true },
        { text: 'Custom Domain', available: false },
        { text: 'Analytics', available: false },
        { text: 'Priority Support', available: false }
      ],
      featured: false,
      delay: 100
    },
    {
      name: 'Professional',
      price: 49,
      period: 'month',
      features: [
        { text: '15 Projects', available: true },
        { text: '50GB Storage', available: true },
        { text: 'Premium Support', available: true },
        { text: 'Custom Domain', available: true },
        { text: 'Analytics', available: true },
        { text: 'Priority Support', available: false }
      ],
      featured: true,
      delay: 200
    },
    {
      name: 'Enterprise',
      price: 99,
      period: 'month',
      features: [
        { text: 'Unlimited Projects', available: true },
        { text: '100GB Storage', available: true },
        { text: '24/7 Support', available: true },
        { text: 'Custom Domain', available: true },
        { text: 'Advanced Analytics', available: true },
        { text: 'Priority Support', available: true }
      ],
      featured: false,
      delay: 300
    }
  ];

  faqs = [
    {
      question: 'Can I upgrade my plan later?',
      answer: 'Yes, you can upgrade your plan at any time. The new pricing will be prorated for the remainder of your billing period.'
    },
    {
      question: 'Do you offer custom plans?',
      answer: 'Yes, we offer custom enterprise plans tailored to your specific needs. Contact us to discuss your requirements.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
    }
  ];
}
