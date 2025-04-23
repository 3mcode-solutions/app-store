import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../shared/services/cart.service';
import { Product } from '../../shared/interfaces/product.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems$ = this.cartService.getCartItems();

  constructor(private cartService: CartService) {}

  ngOnInit(): void {}

  updateQuantity(productId: number, quantity: number): void {
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  calculateTotal(items: any[]): number {
    return items.reduce((total, item) => {
      const price = item.discount ?
        item.price * (1 - item.discount/100) :
        item.price;
      return total + (price * item.quantity);
    }, 0);
  }
}
