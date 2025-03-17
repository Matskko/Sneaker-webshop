import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, Product } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: '<main class="container">' +
    '<section class="hero">' +
      '<div class="hero-content">' +
        '<div class="hero-text">' +
          '<h1>Premium Sneaker Collection</h1>' +
          '<p>Discover the latest and most iconic sneakers from top brands</p>' +
          '<button class="btn-primary" (click)="addToCart(featuredShoe)">Add to Cart - ${{featuredShoe.price}}</button>' +
        '</div>' +
        '<div class="hero-image">' +
          '<img [src]="featuredShoe.image" [alt]="featuredShoe.name">' +
        '</div>' +
      '</div>' +
    '</section>' +
    '<section class="info-section">' +
      '<div class="info-grid">' +
        '<div class="info-card">' +
          '<h3>Free Shipping</h3>' +
          '<p>On orders over $100</p>' +
        '</div>' +
        '<div class="info-card">' +
          '<h3>Secure Payment</h3>' +
          '<p>100% secure payment</p>' +
        '</div>' +
        '<div class="info-card">' +
          '<h3>24/7 Support</h3>' +
          '<p>Dedicated support</p>' +
        '</div>' +
      '</div>' +
    '</section>' +
    '<section class="featured-products">' +
      '<h2>Featured Collection</h2>' +
      '<div class="product-grid">' +
        '<div class="product-card" *ngFor="let product of products">' +
          '<img [src]="product.image" [alt]="product.name">' +
          '<h3>{{product.name}}</h3>' +
          '<p class="price">${{product.price}}</p>' +
          '<button class="btn-primary" (click)="addToCart(product)">Add to Cart</button>' +
        '</div>' +
      '</div>' +
    '</section>' +
  '</main>',
  styles: [`
    .hero {
      background: linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%);
      padding: 6rem 2rem;
      margin: 2rem auto;
      border-radius: 20px;
      max-width: 1400px;
    }
    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 6rem;
    }
    .hero-text h1 {
      font-size: 3.5rem;
      font-weight: 700;
      background: linear-gradient(to right, #2d3748, #4a5568);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }
    .hero-text p {
      font-size: 1.25rem;
      color: #64748b;
      margin-bottom: 2.5rem;
      line-height: 1.6;
    }
    .hero-image img {
      max-width: 100%;
      height: auto;
      transform: rotate(-12deg) scale(1.1);
      filter: drop-shadow(0 25px 25px rgba(0,0,0,0.15));
      transition: transform 0.3s ease;
    }
    .hero-image img:hover {
      transform: rotate(-12deg) scale(1.15);
    }
    .info-section {
      padding: 4rem 0;
      background: white;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 3rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    .info-card {
      text-align: center;
      padding: 2.5rem;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .info-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
    }
    .info-card h3 {
      color: #1a202c;
      font-size: 1.5rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }
    .info-card p {
      color: #64748b;
      font-size: 1rem;
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2.5rem;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .product-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.3s ease;
      border: 1px solid #f1f1f1;
    }
    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
    }
    .product-card img {
      width: 100%;
      height: 220px;
      object-fit: cover;
      border-radius: 12px;
      margin-bottom: 1.5rem;
    }
    .product-card h3 {
      font-size: 1.25rem;
      color: #1a202c;
      margin: 1rem 0;
      font-weight: 600;
    }
    .price {
      color: #2d3748;
      font-weight: 700;
      font-size: 1.5rem;
      margin: 0.75rem 0;
    }
    .btn-primary {
      background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      width: 100%;
      font-size: 1rem;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(49, 130, 206, 0.3);
    }
    .featured-products {
      padding: 4rem 2rem;
    }
    .featured-products h2 {
      text-align: center;
      font-size: 2.5rem;
      color: #1a202c;
      margin-bottom: 3rem;
      font-weight: 700;
    }
    @media (max-width: 768px) {
      .hero-content {
        flex-direction: column;
        text-align: center;
        gap: 3rem;
      }
      .info-grid {
        grid-template-columns: 1fr;
      }
      .hero-text h1 {
        font-size: 2.5rem;
      }
    }
  `]
})
export class HomeComponent {
  constructor(private cartService: CartService) {}

  featuredShoe: Product = {
    id: 4,
    name: 'Nike Air Jordan 1',
    price: 179.99,
    image: 'assets/images/air-jordan-1.jpg'
  };

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