import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Account Settings</h2>
      
      <div class="profile-section" *ngIf="profile">
        <div class="email-display">
          <strong>Email:</strong> {{ profile.email }}
        </div>
        
        <form (ngSubmit)="updateProfile()" #profileForm="ngForm">
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              name="fullName"
              [(ngModel)]="profile.full_name"
              class="form-control">
          </div>

          <div class="form-group">
            <label>Gender</label>
            <select 
              name="gender" 
              [(ngModel)]="profile.gender"
              class="form-control">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone"
              [(ngModel)]="profile.phone"
              class="form-control">
          </div>

          <button type="submit" class="btn-primary">Save Changes</button>
        </form>
      </div>

      <div class="loading" *ngIf="loading">Loading...</div>
      <div class="error" *ngIf="error">{{ error }}</div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h2 {
      margin-bottom: 2rem;
      color: #333;
    }
    .profile-section {
      margin-top: 1rem;
    }
    .email-display {
      margin-bottom: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }
    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    .btn-primary {
      width: 100%;
      padding: 0.8rem;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
    .btn-primary:hover {
      background: #45a049;
    }
    .error {
      color: red;
      margin-top: 1rem;
    }
  `]
})
export class AccountComponent implements OnInit {
  profile: any = null;
  loading = true;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private supabaseService: SupabaseService
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
} 