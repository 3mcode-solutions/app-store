import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../shared/interfaces/product.interface';
import { WishlistService } from '../../shared/services/wishlist.service';
import { CartService } from '../../shared/services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems$!: Observable<Product[]>;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.wishlistItems$ = this.wishlistService.getWishlistItems();
  }

  removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  clearWishlist(): void {
    this.wishlistService.clearWishlist();
  }

  shareProduct(product: Product): void {
    const text = `تحقق من ${product.name} على متجرنا`;
    const url = window.location.origin + '/products?id=' + product.id;

    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: text,
        url: url
      });
    } else {
      // نسخ الرابط إلى الحافظة
      navigator.clipboard.writeText(`${text}\n${url}`);
    }
  }
}
