import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, Product } from '../../services/cart.service';
import { SupabaseService } from '../../services/supabase.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <div class="products-header">
        <h1>All Sneakers</h1>
        <div class="filters">
          <select (change)="filterByBrand($event)" class="filter-select">
            <option value="">All Brands</option>
            <option *ngFor="let brand of brands" [value]="brand">{{brand}}</option>
          </select>
          <select (change)="sortProducts($event)" class="filter-select">
            <option value="default">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>
      
      <div class="products-grid">
        <div class="product-card" *ngFor="let product of filteredProducts">
          <div class="product-image" (click)="showProductDetails(product)">
            <img [src]="product.image" [alt]="product.name">
            <div class="product-actions">
              <button class="btn-favorite" (click)="toggleFavorite($event, product)" [class.active]="isFavorite(product)">
                ❤
              </button>
            </div>
          </div>
          <div class="product-info">
            <h3>{{product.name}}</h3>
            <p class="price">\${{product.price}}</p>
            <div class="card-actions">
              <button class="btn-primary" (click)="addToCart(product)">Add to Cart</button>
              <button class="btn-secondary" (click)="showProductDetails(product)">Details</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="no-products" *ngIf="filteredProducts.length === 0">
        <p>No products found matching your criteria.</p>
        <button class="btn-primary" (click)="resetFilters()">Reset Filters</button>
      </div>
    </div>
    
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
              <button class="btn-primary" (click)="addToCart(selectedProduct); closeDialog()">
                Add to Cart
              </button>
              <button class="btn-favorite-large" (click)="toggleFavorite($event, selectedProduct)" [class.active]="isFavorite(selectedProduct)">
                {{isFavorite(selectedProduct) ? 'Remove from Favorites' : 'Add to Favorites'}}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  error: string | null = null;
  
  searchQuery = '';
  selectedPriceRange = 'all';
  selectedBrand = 'all';
  brands: string[] = [];
  selectedProduct: Product | null = null;
  favorites$ = this.favoritesService.favorites$;
  favoriteIds: number[] = [];

  constructor(
    private cartService: CartService,
    private supabaseService: SupabaseService,
    private favoritesService: FavoritesService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    try {
      this.loading = true;
      this.allProducts = await this.supabaseService.getProducts();
      this.filteredProducts = [...this.allProducts];
      
      // Extract unique brands
      this.brands = [...new Set(this.allProducts.map(p => this.getBrand(p.name)))];
      
      // Subscribe to favorites
      this.favorites$.subscribe(favorites => {
        this.favoriteIds = favorites.map(f => f.id);
      });
      
      if (!this.allProducts || this.allProducts.length === 0) {
        this.error = 'No products found';
      }
    } catch (error: any) {
      console.error('Error loading products:', error);
      this.error = error.message || 'Failed to load products';
    } finally {
      this.loading = false;
    }
  }

  filterProducts() {
    let filtered = [...this.allProducts];

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query)
      );
    }

    // Apply brand filter
    if (this.selectedBrand !== 'all') {
      filtered = filtered.filter(p => 
        this.getBrand(p.name) === this.selectedBrand
      );
    }

    // Apply price filter
    if (this.selectedPriceRange !== 'all') {
      const [min, max] = this.getPriceRange();
      filtered = filtered.filter(p => 
        p.price >= min && (max ? p.price <= max : true)
      );
    }

    this.filteredProducts = filtered;
  }

  private getBrand(name: string): string {
    return name.split(' ')[0]; // Assumes brand is first word
  }

  private getPriceRange(): [number, number | null] {
    switch (this.selectedPriceRange) {
      case '0-100': return [0, 100];
      case '100-150': return [100, 150];
      case '150-200': return [150, 200];
      case '200+': return [200, null];
      default: return [0, null];
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  async toggleFavorite(event: Event, product: Product) {
    event.stopPropagation(); // Prevent dialog from opening when clicking favorite button
    await this.favoritesService.toggleFavorite(product);
  }

  isFavorite(product: Product): boolean {
    return this.favoriteIds.includes(product.id);
  }

  showProductDetails(product: Product) {
    this.selectedProduct = product;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when dialog is open
  }

  closeDialog() {
    this.selectedProduct = null;
    document.body.style.overflow = ''; // Restore scrolling
  }

  filterByBrand(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedBrand = select.value;
    this.applyFilters();
  }

  sortProducts(event: Event) {
    const select = event.target as HTMLSelectElement;
    const sortValue = select.value;
    
    switch(sortValue) {
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Reset to original order
        this.applyFilters();
    }
  }

  applyFilters() {
    if (this.selectedBrand) {
      this.filteredProducts = this.allProducts.filter(p => 
        this.getBrand(p.name) === this.selectedBrand
      );
    } else {
      this.filteredProducts = [...this.allProducts];
    }
  }

  resetFilters() {
    this.selectedBrand = '';
    this.filteredProducts = [...this.allProducts];
    
    // Reset the select elements
    const selects = document.querySelectorAll('.filter-select') as NodeListOf<HTMLSelectElement>;
    selects.forEach(select => {
      select.selectedIndex = 0;
    });
  }
} 