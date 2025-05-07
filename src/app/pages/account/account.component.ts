import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase.service';
import { FavoritesService } from '../../services/favorites.service';
import { CartService, Product } from '../../services/cart.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  profile: any = null;
  loading = true;
  error: string | null = null;
  favorites$ = this.favoritesService.favorites$;

  constructor(
    private authService: AuthService,
    private supabaseService: SupabaseService,
    private favoritesService: FavoritesService,
    private cartService: CartService
  ) {}

  async ngOnInit() {
    try {
      this.loading = true;
      const user = await this.authService.getCurrentUser();
      if (user) {
        this.profile = await this.supabaseService.getProfile(user.id);
        if (!this.profile) {
          // Initialize profile if it doesn't exist
          this.profile = {
            id: user.id,
            email: user.email,
            full_name: '',
            gender: '',
            phone: ''
          };
        }
      }
    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }

  async updateProfile() {
    try {
      this.loading = true;
      await this.supabaseService.updateProfile(this.profile);
      alert('Profile updated successfully!');
    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }

  async removeFavorite(product: Product) {
    await this.favoritesService.toggleFavorite(product);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
} 