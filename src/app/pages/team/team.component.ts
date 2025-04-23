import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent {
  pageTitle = {
    title: 'Team',
    description: 'Meet our talented team of professionals who are dedicated to delivering excellence.'
  };

  teamMembers = [
    {
      name: 'Ahmed Hassan',
      position: 'Chief Executive Officer',
      image: 'assets/img/team/team-1.jpg',
      bio: 'Expert strategist with over 15 years of industry experience.',
      social: {
        twitter: '#',
        facebook: '#',
        instagram: '#',
        linkedin: '#'
      },
      delay: 100
    },
    {
      name: 'Sara Mohamed',
      position: 'Product Manager',
      image: 'assets/img/team/team-2.jpg',
      bio: 'Innovative product manager with a track record of successful launches.',
      social: {
        twitter: '#',
        facebook: '#',
        instagram: '#',
        linkedin: '#'
      },
      delay: 200
    },
    {
      name: 'Karim Ali',
      position: 'Technical Lead',
      image: 'assets/img/team/team-3.jpg',
      bio: 'Experienced technical leader specializing in modern web technologies.',
      social: {
        twitter: '#',
        facebook: '#',
        instagram: '#',
        linkedin: '#'
      },
      delay: 300
    },
    {
      name: 'Nour Ahmed',
      position: 'Marketing Specialist',
      image: 'assets/img/team/team-4.jpg',
      bio: 'Creative marketing professional with expertise in digital strategies.',
      social: {
        twitter: '#',
        facebook: '#',
        instagram: '#',
        linkedin: '#'
      },
      delay: 400
    }
  ];

  stats = [
    {
      count: 232,
      title: 'Happy Clients',
      icon: 'bi bi-emoji-smile'
    },
    {
      count: 521,
      title: 'Projects',
      icon: 'bi bi-journal-richtext'
    },
    {
      count: 1463,
      title: 'Hours Of Support',
      icon: 'bi bi-headset'
    },
    {
      count: 15,
      title: 'Team Members',
      icon: 'bi bi-people'
    }
  ];
}
