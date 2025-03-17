import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-dialog',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="dialog-overlay" (click)="close()">' +
    '<div class="dialog-content" (click)="$event.stopPropagation()">' +
      '<div class="dialog-header">' +
        '<h2>Shopping Cart</h2>' +
        '<button class="close-btn" (click)="close()">×</button>' +
      '</div>' +
      '<div class="cart-items">' +
        '<div *ngFor="let item of cartService.getItems()" class="cart-item">' +
          '<img [src]="item.image" [alt]="item.name">' +
          '<div class="item-details">' +
            '<h3>{{item.name}}</h3>' +
            '<p>Quantity: {{item.quantity}}</p>' +
            '<p class="price">${{item.price * (item.quantity || 1)}}</p>' +
          '</div>' +
          '<button class="remove-btn" (click)="cartService.removeItem(item.id)">Remove</button>' +
        '</div>' +
      '</div>' +
      '<div class="cart-footer" *ngIf="cartService.getItems().length > 0">' +
        '<p class="total">Total: ${{cartService.getTotal() | number:"1.2-2"}}</p>' +
        '<button class="checkout-btn">Checkout</button>' +
      '</div>' +
      '<p *ngIf="cartService.getItems().length === 0" class="empty-cart">Your cart is empty</p>' +
    '</div>' +
  '</div>',
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .dialog-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
    }

    .cart-item {
      display: flex;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #eee;
    }

    .cart-item img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      margin-right: 15px;
    }

    .item-details {
      flex-grow: 1;
    }

    .remove-btn {
      padding: 5px 10px;
      background-color: #ff4444;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .cart-footer {
      margin-top: 20px;
      text-align: right;
    }

    .total {
      font-size: 1.2em;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .checkout-btn {
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .empty-cart {
      text-align: center;
      padding: 20px;
      color: #666;
    }
  `]
})
export class CartDialogComponent {
  constructor(public cartService: CartService) {}

  close() {
    this.cartService.closeDialog();
  }
} 