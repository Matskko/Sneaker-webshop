import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, Product } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="container">' +
    '<h2 class="section-title">Our Collection</h2>' +
    '<div class="product-grid">' +
      '<div class="product-card" *ngFor="let product of products">' +
        '<img [src]="product.image" [alt]="product.name">' +
        '<h3>{{product.name}}</h3>' +
        '<p class="price">${{product.price}}</p>' +
        '<button class="btn-primary" (click)="addToCart(product)">Add to Cart</button>' +
      '</div>' +
    '</div>' +
  '</div>',
  styles: [`
    .section-title {
      text-align: center;
      margin: 3rem 0;
      font-size: 2.5rem;
      color: #1a202c;
      font-weight: 700;
    }
  `]
})
export class ProductsComponent {
  constructor(private cartService: CartService) {}

  products: Product[] = [
    {
      id: 1,
      name: 'Nike Air Max',
      price: 129.99,
      image: 'assets/images/nike-air-max.jpg'
    },
    {
      id: 2,
      name: 'Adidas Ultraboost',
      price: 159.99,
      image: 'assets/images/adidas-ultraboost.jpg'
    },
    {
      id: 3,
      name: 'Puma RS-X',
      price: 89.99,
      image: 'assets/images/puma-rsx.jpg'
    },
    {
      id: 4,
      name: 'Nike Air Jordan 1',
      price: 179.99,
      image: 'assets/images/air-jordan-1.jpg'
    },
    {
      id: 5,
      name: 'New Balance 574',
      price: 99.99,
      image: 'assets/images/new-balance-574.jpg'
    },
    {
      id: 6,
      name: 'Converse Chuck 70',
      price: 85.99,
      image: 'assets/images/converse-chuck-70.jpg'
    },
    {
      id: 7,
      name: 'Vans Old Skool',
      price: 69.99,
      image: 'assets/images/vans-old-skool.jpg'
    },
    {
      id: 8,
      name: 'Reebok Classic',
      price: 79.99,
      image: 'assets/images/reebok-classic.jpg'
    },
    {
      id: 9,
      name: 'Asics Gel-Lyte III',
      price: 119.99,
      image: 'assets/images/asics-gel-lyte.jpg'
    }
  ];

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
} 