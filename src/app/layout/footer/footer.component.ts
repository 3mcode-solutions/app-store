import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  email: string = '';
  isSubscribing = false;
  subscribeSuccess = false;
  subscribeError = false;
  errorMessage = '';

  onSubscribe() {
    if (!this.email) return;

    this.isSubscribing = true;
    this.subscribeSuccess = false;
    this.subscribeError = false;

    // محاكاة لعملية الاشتراك - سيتم استبدالها لاحقاً بطلب API حقيقي
    setTimeout(() => {
      if (this.email.includes('@')) {
        this.subscribeSuccess = true;
        this.email = '';
      } else {
        this.subscribeError = true;
        this.errorMessage = 'يرجى إدخال بريد إلكتروني صحيح';
      }
      this.isSubscribing = false;
    }, 1500);
  }
}
