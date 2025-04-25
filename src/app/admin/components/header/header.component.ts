import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // تهيئة المكون عند التحميل
  }

  /**
   * تبديل حالة الشريط الجانبي
   */
  toggleSidebar() {
    document.body.classList.toggle('toggle-sidebar');
  }
}
