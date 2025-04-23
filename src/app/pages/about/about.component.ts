import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  pageTitle = {
    title: 'About Us',
    description: 'Learn more about our company, our mission, and our dedication to providing exceptional services and solutions.'
  };
}
