import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent {
  pageTitle = {
    title: 'Features',
    description: 'Discover our comprehensive set of features designed to enhance your business capabilities and drive success.'
  };

  features = [
    {
      icon: 'bi bi-cpu',
      title: 'Advanced Technology',
      description: 'Utilizing cutting-edge technology to deliver powerful solutions.',
      delay: 100
    },
    {
      icon: 'bi bi-gear',
      title: 'Customization',
      description: 'Tailor-made solutions to meet your specific business needs.',
      delay: 200
    },
    {
      icon: 'bi bi-graph-up',
      title: 'Scalability',
      description: 'Solutions that grow with your business needs.',
      delay: 300
    },
    {
      icon: 'bi bi-shield-check',
      title: 'Security',
      description: 'Enterprise-grade security for your peace of mind.',
      delay: 400
    },
    {
      icon: 'bi bi-lightning',
      title: 'Performance',
      description: 'Optimized for maximum speed and efficiency.',
      delay: 500
    },
    {
      icon: 'bi bi-headset',
      title: 'Support',
      description: '24/7 dedicated support team at your service.',
      delay: 600
    }
  ];
}
