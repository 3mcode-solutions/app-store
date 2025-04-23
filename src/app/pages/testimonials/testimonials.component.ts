import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent {
  pageTitle = {
    title: 'Testimonials',
    description: 'See what our clients say about our services and solutions.'
  };

  testimonials = [
    {
      name: 'Sarah Johnson',
      position: 'CEO, Tech Solutions',
      image: 'assets/img/testimonials/testimonials-1.jpg',
      quote: 'Working with this team has been an absolute pleasure. Their expertise and dedication to delivering quality solutions is remarkable.',
      rating: 5,
      delay: 100
    },
    {
      name: 'Michael Chen',
      position: 'CTO, Innovation Labs',
      image: 'assets/img/testimonials/testimonials-2.jpg',
      quote: 'The technical expertise and professional approach of the team helped us achieve our goals ahead of schedule.',
      rating: 5,
      delay: 200
    },
    {
      name: 'Emily Brown',
      position: 'Marketing Director, Global Reach',
      image: 'assets/img/testimonials/testimonials-3.jpg',
      quote: 'Their strategic insights and innovative solutions have significantly improved our digital presence.',
      rating: 4,
      delay: 300
    },
    {
      name: 'David Wilson',
      position: 'Founder, StartUp Hub',
      image: 'assets/img/testimonials/testimonials-4.jpg',
      quote: 'Outstanding service and support. They truly understand the needs of growing businesses.',
      rating: 5,
      delay: 400
    },
    {
      name: 'Lisa Martinez',
      position: 'Project Manager, Enterprise Co',
      image: 'assets/img/testimonials/testimonials-5.jpg',
      quote: 'Excellent communication and project management. Delivered exactly what we needed.',
      rating: 5,
      delay: 500
    }
  ];

  stats = [
    {
      count: 232,
      title: 'Happy Clients',
      description: 'Satisfied customers who trust our services',
      icon: 'bi bi-emoji-smile'
    },
    {
      count: 521,
      title: 'Projects',
      description: 'Successfully completed projects',
      icon: 'bi bi-journal-richtext'
    },
    {
      count: 1463,
      title: 'Support Hours',
      description: 'Hours of dedicated support provided',
      icon: 'bi bi-headset'
    },
    {
      count: 15,
      title: 'Team Members',
      description: 'Expert professionals at your service',
      icon: 'bi bi-people'
    }
  ];

  getRatingStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
