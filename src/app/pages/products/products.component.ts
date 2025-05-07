import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, Product } from '../../services/cart.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: '<div class="container">' +
    '<h2 class="section-title">Our Collection</h2>' +
    '<div *ngIf="loading" class="loading-spinner">Loading...</div>' +
    '<div *ngIf="error" class="error-message">{{ error }}</div>' +
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
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
      padding: 2rem;
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
      width: 100%;
      padding: 0.8rem;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-primary:hover {
      background: #45a049;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private cartService: CartService,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    try {
      this.loading = true;
      this.products = await this.supabaseService.getProducts();
      console.log('Loaded products:', this.products); // Debug log
      
      if (!this.products || this.products.length === 0) {
        this.error = 'No products found';
      }
    } catch (error: any) {
      console.error('Error loading products:', error);
      this.error = error.message || 'Failed to load products';
    } finally {
      this.loading = false;
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
} 