import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { Product } from './cart.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<Product[]>([]);
  favorites$ = this.favoritesSubject;

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    // Load favorites when user logs in
    this.authService.user$.subscribe(user => {
      if (user) {
        this.loadFavorites();
      } else {
        this.favoritesSubject.next([]);
      }
    });
  }

  async loadFavorites() {
    const user = await this.authService.getCurrentUser();
    if (!user) return;

    try {
      const { data, error } = await this.supabaseService.supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        const productIds = data.map(fav => fav.product_id);
        const products = await this.supabaseService.getProductsByIds(productIds);
        this.favoritesSubject.next(products);
      } else {
        this.favoritesSubject.next([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }

  async toggleFavorite(product: Product): Promise<boolean> {
    const user = await this.authService.getCurrentUser();
    
    if (!user) {
      this.notificationService.showMessage('Please login to add favorites');
      return false;
    }

    try {
      const isFavorite = await this.isProductFavorite(product.id);
      
      if (isFavorite) {
        // Remove from favorites
        const { error } = await this.supabaseService.supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);

        if (error) throw error;
        
        this.notificationService.showMessage(`Removed ${product.name} from favorites`);
        
        // Update local favorites list
        const currentFavorites = this.favoritesSubject.value;
        this.favoritesSubject.next(
          currentFavorites.filter(p => p.id !== product.id)
        );
        
        return false;
      } else {
        // Add to favorites
        const { error } = await this.supabaseService.supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: product.id
          });

        if (error) throw error;
        
        this.notificationService.showMessage(`Added ${product.name} to favorites`);
        
        // Update local favorites list
        const currentFavorites = this.favoritesSubject.value;
        this.favoritesSubject.next([...currentFavorites, product]);
        
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      this.notificationService.showMessage('Error updating favorites');
      return false;
    }
  }

  async isProductFavorite(productId: number): Promise<boolean> {
    const user = await this.authService.getCurrentUser();
    if (!user) return false;

    try {
      const { data, error } = await this.supabaseService.supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore 'no rows returned' error
      
      return !!data;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }
} 