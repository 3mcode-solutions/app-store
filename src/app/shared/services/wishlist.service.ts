import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems = new BehaviorSubject<Product[]>([]);
  
  constructor() {
    // استرجاع المفضلة من localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlistItems.next(JSON.parse(savedWishlist));
    }
  }

  getWishlistItems(): Observable<Product[]> {
    return this.wishlistItems.asObservable();
  }

  addToWishlist(product: Product): void {
    const currentItems = this.wishlistItems.value;
    if (!this.isInWishlist(product.id)) {
      this.wishlistItems.next([...currentItems, product]);
      this.saveWishlistToStorage();
    }
  }

  removeFromWishlist(productId: number): void {
    const currentItems = this.wishlistItems.value;
    this.wishlistItems.next(currentItems.filter(item => item.id !== productId));
    this.saveWishlistToStorage();
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems.value.some(item => item.id === productId);
  }

  clearWishlist(): void {
    this.wishlistItems.next([]);
    localStorage.removeItem('wishlist');
  }

  private saveWishlistToStorage(): void {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems.value));
  }
}