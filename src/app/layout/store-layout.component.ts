import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

declare var AOS: any;
declare var PureCounter: any;

@Component({
  selector: 'app-store-layout',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `
})
export class StoreLayoutComponent implements OnInit {
  ngOnInit() {
    // تهيئة AOS للانيميشن
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });

      // تحديث AOS عند تغيير المسار
      window.addEventListener('load', () => {
        AOS.refresh();
      });
    }

    // تهيئة PureCounter للعدادات
    if (typeof PureCounter !== 'undefined') {
      new PureCounter();
    }
  }
}
