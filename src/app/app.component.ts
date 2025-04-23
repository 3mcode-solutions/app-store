import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

declare var AOS: any;
declare var PureCounter: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FlexStart';

  ngOnInit() {
    // تهيئة AOS للانيميشن
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });

    // تهيئة PureCounter للعدادات
    new PureCounter();

    // تحديث AOS عند تغيير المسار
    window.addEventListener('load', () => {
      AOS.refresh();
    });
  }
}
