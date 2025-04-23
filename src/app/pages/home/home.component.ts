import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // البيانات الرئيسية للصفحة
  heroData = {
    title: 'Welcome to FlexStart',
    description: 'We are team of talented designers making websites with Bootstrap',
    buttonText: 'Get Started',
    buttonLink: '#about'
  };
}
