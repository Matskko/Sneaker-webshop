import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase.service';
import { FavoritesService } from '../../services/favorites.service';
import { CartService, Product } from '../../services/cart.service';
import { ReviewService, Review } from '../../services/review.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  profile: any = null;
  loading = true;
  error: string | null = null;
  favorites$ = this.favoritesService.favorites$;
  userReviews: Review[] = [];
  newReview = {
    productId: 0,
    rating: 0,
    comment: '',
    featured: false
  };
  products: Product[] = [];
  showReviewForm = false;

  constructor(
    private authService: AuthService,
    private supabaseService: SupabaseService,
    private favoritesService: FavoritesService,
    private cartService: CartService,
    private reviewService: ReviewService
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
      
      // Load user reviews
      await this.loadUserReviews();
      
      // Load products for the dropdown
      this.products = await this.supabaseService.getProducts();
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

  async loadUserReviews() {
    this.userReviews = await this.reviewService.getUserReviews();
  }

  async deleteReview(reviewId: number) {
    if (confirm('Are you sure you want to delete this review?')) {
      const success = await this.reviewService.deleteReview(reviewId);
      if (success) {
        await this.loadUserReviews();
      } else {
        alert('Failed to delete review. Please try again.');
      }
    }
  }

  async toggleFeatured(reviewId: number, featured: boolean) {
    const success = await this.reviewService.toggleFeatured(reviewId, !featured);
    if (success) {
      await this.loadUserReviews();
    } else {
      alert('Failed to update review. Please try again.');
    }
  }

  async submitReview() {
    if (!this.newReview.productId || !this.newReview.rating || !this.newReview.comment) {
      alert('Please fill in all fields');
      return;
    }
    
    const success = await this.reviewService.addReview(
      this.newReview.productId,
      this.newReview.rating,
      this.newReview.comment
    );
    
    if (success) {
      this.newReview = {
        productId: 0,
        rating: 0,
        comment: '',
        featured: false
      };
      this.showReviewForm = false;
      await this.loadUserReviews();
    } else {
      alert('Failed to submit review. Please try again.');
    }
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }
} 