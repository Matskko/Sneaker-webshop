import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, Product } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="container">' +
    '<h2>Shopping Cart</h2>' +
    '<div *ngIf="cartService.getItems().length === 0" class="empty-cart">Your cart is empty</div>' +
    '<div class="cart-items">' +
      '<div *ngFor="let item of cartService.getItems()" class="cart-item">' +
        '<img [src]="item.image" [alt]="item.name">' +
        '<div class="item-details">' +
          '<h3>{{item.name}}</h3>' +
          '<p class="price">Price: ${{item.price}}</p>' +
          '<div class="quantity-controls">' +
            '<button (click)="cartService.decreaseQuantity(item.id)">-</button>' +
            '<span>{{item.quantity}}</span>' +
            '<button (click)="cartService.addToCart(item)">+</button>' +
          '</div>' +
        '</div>' +
        '<div class="item-total">' +
          '<p>${{item.price * (item.quantity || 1)}}</p>' +
          '<button class="remove-btn" (click)="cartService.removeItem(item.id)">Remove</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div *ngIf="cartService.getItems().length > 0" class="cart-total">' +
      '<h3>Total: ${{cartService.getTotal() | number:"1.2-2"}}</h3>' +
      '<button class="checkout-btn">Proceed to Checkout</button>' +
    '</div>' +
  '</div>',
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1000px;
      margin: 0 auto;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h2 {
      margin-bottom: 2rem;
      color: #333;
      font-size: 1.8rem;
    }
    .cart-items {
      border-top: 1px solid #eee;
    }
    .cart-item {
      display: flex;
      align-items: center;
      padding: 1.5rem 0;
      border-bottom: 1px solid #eee;
    }
    .cart-item img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      margin-right: 1.5rem;
    }
    .item-details {
      flex-grow: 1;
    }
    .item-details h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.1rem;
    }
    .price {
      color: #666;
      font-size: 0.9rem;
      margin: 0.2rem 0;
    }
    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-top: 0.5rem;
    }
    .quantity-controls button {
      width: 28px;
      height: 28px;
      border: 1px solid #ddd;
      background: #fff;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .quantity-controls button:hover {
      background: #f5f5f5;
    }
    .quantity-controls span {
      font-size: 0.9rem;
      color: #333;
    }
    .item-total {
      text-align: right;
      min-width: 100px;
    }
    .item-total p {
      font-weight: 600;
      color: #333;
      margin: 0 0 0.5rem 0;
    }
    .remove-btn {
      padding: 0.4rem 0.8rem;
      border: none;
      background: #ff4444;
      color: white;
      border-radius: 4px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .remove-btn:hover {
      background: #ff2020;
    }
    .empty-cart {
      text-align: center;
      padding: 3rem;
      color: #666;
      font-size: 1.1rem;
    }
    .cart-total {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 2px solid #eee;
      text-align: right;
    }
    .cart-total h3 {
      color: #333;
      font-size: 1.4rem;
      margin-bottom: 1rem;
    }
    .checkout-btn {
      padding: 0.8rem 1.5rem;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .checkout-btn:hover {
      background: #45a049;
    }
  `]
})
export class CartComponent {
  constructor(public cartService: CartService) {}
} 