import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CartService, Product } from '../../services/cart.service';
import { SupabaseService } from '../../services/supabase.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  selectedSize: string = '';
  sizes = ['US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 11.5', 'US 12'];

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private cartService: CartService,
    private favoritesService: FavoritesService
  ) {}

  async ngOnInit() {
    try {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (isNaN(id)) {
        this.error = 'Invalid product ID';
        return;
      }

      const products = await this.supabaseService.getProducts();
      this.product = products.find(p => p.id === id) || null;
      
      if (!this.product) {
        this.error = 'Product not found';
      }
    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }

  addToCart() {
    if (this.product && this.selectedSize) {
      this.cartService.addToCart({...this.product, size: this.selectedSize});
    }
  }

  async toggleFavorite() {
    if (this.product) {
      await this.favoritesService.toggleFavorite(this.product);
    }
  }

  isFavorite(): boolean {
    if (!this.product) return false;
    const favorites = this.favoritesService.favorites$.getValue();
    return favorites.some(p => p.id === this.product?.id);
  }
} 