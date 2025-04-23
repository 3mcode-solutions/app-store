import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-values',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './values.component.html',
  styleUrls: ['./values.component.css']
})
export class ValuesComponent {
  pageTitle = {
    title: 'Our Values',
    description: 'The core values that guide our work and define our company culture.'
  };

  values = [
    {
      icon: 'assets/img/values-1.png',
      title: 'Innovation',
      description: 'We believe in pushing boundaries and exploring new possibilities to deliver cutting-edge solutions.',
      details: [
        'Continuous improvement',
        'Creative problem-solving',
        'Embracing new technologies',
        'Forward-thinking approach'
      ],
      delay: 100
    },
    {
      icon: 'assets/img/values-2.png',
      title: 'Quality',
      description: 'We maintain the highest standards in everything we do, from code to customer service.',
      details: [
        'Rigorous testing',
        'Best practices',
        'Attention to detail',
        'Performance optimization'
      ],
      delay: 200
    },
    {
      icon: 'assets/img/values-3.png',
      title: 'Integrity',
      description: 'We conduct our business with honesty, transparency, and strong ethical principles.',
      details: [
        'Ethical conduct',
        'Transparent communication',
        'Responsible practices',
        'Trust building'
      ],
      delay: 300
    }
  ];

  principles = [
    {
      title: 'Customer Focus',
      description: 'Our customers are at the heart of everything we do.',
      icon: 'bi bi-people'
    },
    {
      title: 'Excellence',
      description: 'We strive for excellence in every project we undertake.',
      icon: 'bi bi-award'
    },
    {
      title: 'Collaboration',
      description: 'We believe in the power of teamwork and partnership.',
      icon: 'bi bi-people-fill'
    }
  ];
}
