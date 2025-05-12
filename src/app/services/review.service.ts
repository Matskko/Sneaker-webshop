import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

export interface Review {
  id?: number;
  user_id: string;
  product_id: number;
  rating: number;
  comment: string;
  featured?: boolean;
  created_at?: string;
  user_name?: string;
  product_name?: string;
  product_image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {}

  async getFeaturedReviews(): Promise<Review[]> {
    try {
      const { data, error } = await this.supabaseService.supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (full_name),
          products:product_id (name, image)
        `)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      // Format the data to include user_name and product details
      return (data || []).map(review => ({
        ...review,
        user_name: review.profiles?.full_name || 'Anonymous',
        product_name: review.products?.name,
        product_image: review.products?.image
      }));
    } catch (error) {
      console.error('Error fetching featured reviews:', error);
      return [];
    }
  }

  async getProductReviews(productId: number): Promise<Review[]> {
    try {
      const { data, error } = await this.supabaseService.supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(review => ({
        ...review,
        user_name: review.profiles?.full_name || 'Anonymous'
      }));
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      return [];
    }
  }

  async addReview(productId: number, rating: number, comment: string): Promise<boolean> {
    const user = await this.authService.getCurrentUser();
    if (!user) return false;

    try {
      const { error } = await this.supabaseService.supabase
        .from('reviews')
        .upsert({
          user_id: user.id,
          product_id: productId,
          rating,
          comment,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding review:', error);
      return false;
    }
  }

  async getUserReviewForProduct(productId: number): Promise<Review | null> {
    const user = await this.authService.getCurrentUser();
    if (!user) return null;

    try {
      const { data, error } = await this.supabaseService.supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore 'no rows returned' error
      return data;
    } catch (error) {
      console.error('Error fetching user review:', error);
      return null;
    }
  }

  async getUserReviews(): Promise<Review[]> {
    const user = await this.authService.getCurrentUser();
    if (!user) return [];

    try {
      const { data, error } = await this.supabaseService.supabase
        .from('reviews')
        .select(`
          *,
          products:product_id (name, image)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(review => ({
        ...review,
        product_name: review.products?.name,
        product_image: review.products?.image
      }));
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      return [];
    }
  }

  async deleteReview(reviewId: number): Promise<boolean> {
    const user = await this.authService.getCurrentUser();
    if (!user) return false;

    try {
      const { error } = await this.supabaseService.supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      return false;
    }
  }

  async toggleFeatured(reviewId: number, featured: boolean): Promise<boolean> {
    const user = await this.authService.getCurrentUser();
    if (!user) return false;

    try {
      const { error } = await this.supabaseService.supabase
        .from('reviews')
        .update({ featured })
        .eq('id', reviewId)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating review featured status:', error);
      return false;
    }
  }
} 