import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, Product } from '../../services/cart.service';
import { SupabaseService } from '../../services/supabase.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="announcement-bar">
      <div class="container">
        <p>Free shipping on all orders over $100 | Use code WELCOME10 for 10% off your first order</p>
      </div>
    </div>
    
    <main class="container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <div class="hero-text">
            <span class="hero-badge">New Collection</span>
            <h1>Step Into <span class="highlight">Style</span></h1>
            <p>Discover premium sneakers from top brands. Limited editions, classic styles, and the latest drops all in one place.</p>
            <div class="hero-buttons">
              <a routerLink="/products" class="btn-primary">Shop Collection</a>
              <a routerLink="/products" class="btn-secondary">Explore New Arrivals</a>
            </div>
          </div>
          <div class="hero-image" *ngIf="featuredProduct">
            <div class="hero-image-container">
              <img [src]="featuredProduct.image" [alt]="featuredProduct.name" (click)="showProductDetails(featuredProduct)">
              <div class="hero-product-badge">
                <span class="product-name">{{featuredProduct.name}}</span>
                <span class="product-price">\${{featuredProduct.price}}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Brands Section -->
      <section class="brands-section">
        <h2 class="section-title">Shop by Brand</h2>
        <div class="brands-grid">
          <div class="brand-card">
            <div class="brand-logo">
              <span>N</span>
            </div>
            <h3>Nike</h3>
          </div>
          <div class="brand-card">
            <div class="brand-logo">
              <span>A</span>
            </div>
            <h3>Adidas</h3>
          </div>
          <div class="brand-card">
            <div class="brand-logo">
              <span>NB</span>
            </div>
            <h3>New Balance</h3>
          </div>
          <div class="brand-card">
            <div class="brand-logo">
              <span>P</span>
            </div>
            <h3>Puma</h3>
          </div>
        </div>
      </section>
      
      <!-- Benefits Section -->
      <section class="benefits-section">
        <div class="info-grid">
          <div class="info-card">
            <div class="info-icon">
              <span>🚚</span>
            </div>
            <h3>Free Shipping</h3>
            <p>On orders over $100</p>
          </div>
          <div class="info-card">
            <div class="info-icon">
              <span>🔒</span>
            </div>
            <h3>Secure Payment</h3>
            <p>Safe & secure checkout</p>
          </div>
          <div class="info-card">
            <div class="info-icon">
              <span>↩️</span>
            </div>
            <h3>Easy Returns</h3>
            <p>30 day return policy</p>
          </div>
        </div>
      </section>
      
      <!-- Featured Products -->
      <section class="featured-products">
        <div class="section-header">
          <h2 class="section-title">Featured Collection</h2>
          <a routerLink="/products" class="view-all">View All</a>
        </div>
        <div class="scroll-indicator">Scroll to see more →</div>
        <div class="product-scroll">
          <div class="product-card" *ngFor="let product of featuredProducts">
            <div class="product-image" (click)="showProductDetails(product)">
              <img [src]="product.image" [alt]="product.name">
            </div>
            <div class="product-info">
              <h3>{{product.name}}</h3>
              <p class="price">\${{product.price}}</p>
              <div class="product-actions">
                <button class="btn-primary" (click)="addToCart(product)">
                  🛒 Add to Cart
                </button>
                <button class="btn-secondary" (click)="showProductDetails(product)">
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Newsletter Section -->
      <section class="newsletter-section">
        <div class="newsletter-content">
          <h2>Join Our Newsletter</h2>
          <p>Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Your email address" class="newsletter-input">
            <button class="btn-primary">Subscribe</button>
          </div>
        </div>
      </section>
    </main>

    <!-- Product Details Dialog -->
    <div class="dialog-overlay" *ngIf="selectedProduct" (click)="closeDialog()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <button class="dialog-close" (click)="closeDialog()">×</button>
        <div class="dialog-grid">
          <div class="dialog-image">
            <img [src]="selectedProduct.image" [alt]="selectedProduct.name">
          </div>
          <div class="dialog-info">
            <h2>{{selectedProduct.name}}</h2>
            <p class="dialog-price">\${{selectedProduct.price}}</p>
            <div class="dialog-description">
              <p>Experience ultimate comfort and style with the {{selectedProduct.name}}. These premium sneakers feature advanced cushioning technology, breathable materials, and a sleek design that complements any outfit.</p>
              <p>Perfect for everyday wear or athletic activities, these shoes provide excellent support and durability.</p>
            </div>
            <div class="dialog-details">
              <div class="detail-item">
                <span class="detail-label">Brand:</span>
                <span class="detail-value">{{selectedProduct.name.split(' ')[0]}}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Color:</span>
                <span class="detail-value">Multiple Options</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Material:</span>
                <span class="detail-value">Premium Leather & Mesh</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Availability:</span>
                <span class="detail-value">In Stock</span>
              </div>
            </div>
            <div class="dialog-actions">
              <button class="btn-primary btn-full-width" (click)="addToCart(selectedProduct); closeDialog()">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredProduct: Product | null = null;
  featuredProducts: Product[] = [];
  selectedProduct: Product | null = null;

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
      
      // Get 8 random products for the scrollable row (excluding the hero product)
      const availableProducts = products.filter(p => p.id !== this.featuredProduct?.id);
      this.featuredProducts = this.getRandomProducts(availableProducts, 8);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  // Helper method to get random products
  private getRandomProducts(products: Product[], count: number): Product[] {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  showProductDetails(product: Product) {
    this.selectedProduct = product;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when dialog is open
  }

  closeDialog() {
    this.selectedProduct = null;
    document.body.style.overflow = ''; // Restore scrolling
  }
} 