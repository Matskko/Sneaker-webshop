import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { Product } from '../../services/cart.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <input 
        type="text" 
        [(ngModel)]="searchQuery" 
        (ngModelChange)="onSearchChange($event)"
        placeholder="Search sneakers..."
        class="search-input"
      >
      <div class="search-results" *ngIf="showResults && filteredProducts.length > 0">
        <div 
          class="search-result-item" 
          *ngFor="let product of filteredProducts" 
          (click)="selectProduct(product)"
        >
          <img [src]="product.image" [alt]="product.name">
          <div class="product-info">
            <span class="product-name">{{product.name}}</span>
            <span class="product-price">${{product.price}}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      position: relative;
      width: 100%;
    }
    .search-input {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    .search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 4px 4px;
      max-height: 300px;
      overflow-y: auto;
      z-index: 10;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .search-result-item {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      cursor: pointer;
      border-bottom: 1px solid #eee;
    }
    .search-result-item:hover {
      background: #f9f9f9;
    }
    .search-result-item img {
      width: 50px;
      height: 50px;
      object-fit: contain;
      margin-right: 1rem;
    }
    .product-info {
      display: flex;
      flex-direction: column;
    }
    .product-name {
      font-weight: 500;
    }
    .product-price {
      color: #4CAF50;
      font-weight: bold;
    }
  `]
})
export class SearchBarComponent implements OnInit {
  searchQuery = '';
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  showResults = false;
  private searchSubject = new Subject<string>();

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
    
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.filterProducts(query);
    });
  }

  async loadProducts() {
    try {
      this.allProducts = await this.supabaseService.getProducts();
    } catch (error) {
      console.error('Error loading products for search:', error);
    }
  }

  onSearchChange(query: string) {
    this.searchSubject.next(query);
    this.showResults = query.length > 0;
  }

  filterProducts(query: string) {
    if (!query) {
      this.filteredProducts = [];
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    this.filteredProducts = this.allProducts
      .filter(p => p.name.toLowerCase().includes(lowerQuery))
      .slice(0, 5); // Limit to 5 results
  }

  selectProduct(product: Product) {
    this.searchQuery = '';
    this.showResults = false;
    this.router.navigate(['/product', product.id]);
  }
} 