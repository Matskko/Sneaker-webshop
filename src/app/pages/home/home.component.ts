import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, Product } from '../../services/cart.service';
import { SupabaseService } from '../../services/supabase.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: '<main class="container">' +
    '<section class="hero">' +
      '<div class="hero-content">' +
        '<div class="hero-text">' +
          '<h1>Premium Sneaker Collection</h1>' +
          '<p>Discover the latest and most iconic sneakers from top brands</p>' +
          '<a routerLink="/products" class="btn-primary">Shop Now</a>' +
        '</div>' +
        '<div class="hero-image" *ngIf="featuredProduct">' +
          '<img [src]="featuredProduct.image" [alt]="featuredProduct.name">' +
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
          '<p>Safe & secure checkout</p>' +
        '</div>' +
        '<div class="info-card">' +
          '<h3>Easy Returns</h3>' +
          '<p>30 day return policy</p>' +
        '</div>' +
      '</div>' +
    '</section>' +
    '<section class="featured-products">' +
      '<h2>Featured Collection</h2>' +
      '<div class="product-grid">' +
        '<div class="product-card" *ngFor="let product of featuredProducts">' +
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
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .info-card {
      text-align: center;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .featured-products {
      padding: 4rem 0;
    }
    .featured-products h2 {
      text-align: center;
      margin-bottom: 2rem;
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .product-card {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .product-card:hover {
      transform: translateY(-5px);
    }
    .product-card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 4px;
    }
    .product-card h3 {
      margin: 1rem 0;
      font-size: 1.2rem;
    }
    .price {
      font-weight: bold;
      color: #2d3748;
      font-size: 1.1rem;
    }
    .btn-primary {
      display: inline-block;
      padding: 0.8rem 1.5rem;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s;
    }
    .btn-primary:hover {
      background: #45a049;
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProduct: Product | null = null;
  featuredProducts: Product[] = [];

  constructor(
    private cartService: CartService,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    try {
      // Get all products
      const products = await this.supabaseService.getProducts();
      
      // Find Nike Air Jordan 1 for hero section
      this.featuredProduct = products.find(p => p.name === 'Nike Air Jordan 1') || products[0];
      
      // Get featured products excluding the hero product
      this.featuredProducts = products
        .filter(p => p.id !== this.featuredProduct?.id)
        .slice(0, 6);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
} 