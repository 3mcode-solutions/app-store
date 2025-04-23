import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  pageTitle = {
    title: 'Services',
    description: 'Explore our comprehensive range of services designed to meet your business needs and drive growth.'
  };

  services = [
    {
      icon: 'bi bi-briefcase',
      title: 'Business Consulting',
      description: 'Strategic consulting services to help your business grow and succeed in today\'s competitive market.',
      delay: 100
    },
    {
      icon: 'bi bi-card-checklist',
      title: 'Project Management',
      description: 'Professional project management services ensuring timely delivery and quality results.',
      delay: 200
    },
    {
      icon: 'bi bi-bar-chart',
      title: 'Market Analysis',
      description: 'Detailed market analysis and research to help you make informed business decisions.',
      delay: 300
    },
    {
      icon: 'bi bi-binoculars',
      title: 'Brand Strategy',
      description: 'Comprehensive brand strategy development to strengthen your market position.',
      delay: 400
    },
    {
      icon: 'bi bi-brightness-high',
      title: 'Digital Marketing',
      description: 'Results-driven digital marketing services to boost your online presence.',
      delay: 500
    },
    {
      icon: 'bi bi-calendar4-week',
      title: 'Business Development',
      description: 'Strategic business development services to expand your market reach.',
      delay: 600
    }
  ];

  features = [
    {
      title: 'Expert Team',
      description: 'Our team of seasoned professionals brings years of industry experience.',
      items: [
        'Experienced consultants',
        'Certified professionals',
        'Industry specialists',
        'Dedicated support team'
      ]
    },
    {
      title: 'Quality Service',
      description: 'We maintain the highest standards of service quality and delivery.',
      items: [
        'Quality assurance',
        'Timely delivery',
        'Regular updates',
        'Client satisfaction focus'
      ]
    },
    {
      title: 'Technology',
      description: 'We use cutting-edge technology to deliver optimal results.',
      items: [
        'Latest tools',
        'Modern infrastructure',
        'Security measures',
        'Regular updates'
      ]
    }
  ];
}
