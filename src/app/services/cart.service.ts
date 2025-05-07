import { Injectable, signal } from '@angular/core';
import { computed } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<Product[]>([]);
  private isDialogOpen = signal(false);
  
  cartCount = computed(() => this.cartItems().reduce((acc, item) => acc + (item.quantity || 1), 0));
  dialogOpen = computed(() => this.isDialogOpen());
  
  addToCart(product: Product) {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.id === product.id);
    
    if (existingItem) {
      this.cartItems.update(items => 
        items.map(item => 
          item.id === product.id 
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        )
      );
    } else {
      this.cartItems.update(items => [...items, { ...product, quantity: 1 }]);
    }
  }

  getItems(): Product[] {
    return this.cartItems();
  }

  removeItem(productId: number) {
    this.cartItems.update(items => items.filter(item => item.id !== productId));
  }

  getTotal(): number {
    return this.cartItems().reduce((total, item) => 
      total + (item.price * (item.quantity || 1)), 0);
  }

  openDialog() {
    this.isDialogOpen.set(true);
  }

  closeDialog() {
    this.isDialogOpen.set(false);
  }

  decreaseQuantity(productId: number) {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.id === productId);
    
    if (existingItem) {
      if (existingItem.quantity && existingItem.quantity > 1) {
        this.cartItems.update(items =>
          items.map(item =>
            item.id === productId
              ? { ...item, quantity: item.quantity! - 1 }
              : item
          )
        );
      } else {
        this.removeItem(productId);
      }
    }
  }
} 