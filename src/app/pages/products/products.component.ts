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
  templateUrl: './products.component.html',
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

  async toggleFavorite(product: Product) {
    await this.favoritesService.toggleFavorite(product);
  }

  isFavorite(productId: number): boolean {
    const favorites = this.favoritesService.favorites$.getValue();
    return favorites.some(p => p.id === productId);
  }
} 