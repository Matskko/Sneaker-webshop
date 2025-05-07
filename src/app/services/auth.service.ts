import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    // Get initial session
    this.initSession();
    
    // Listen for auth changes
    this.supabaseService.onAuthChange((event: AuthChangeEvent, session: Session | null) => {
      this.userSubject.next(session?.user || null);
    });
  }

  private async initSession() {
    const session = await this.supabaseService.getSession();
    this.userSubject.next(session?.user || null);
  }

  // Sign up
  async register(email: string, password: string) {
    try {
      await this.supabaseService.signUp(email, password);
      alert('Registration successful! Please check your email for verification.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      alert(error?.message || 'An unknown error occurred');
    }
  }

  // Login
  async login(email: string, password: string) {
    try {
      const data = await this.supabaseService.signIn(email, password);
      if (data) {
        this.router.navigate(['/home']);
        return data;
      }
      throw new Error('Login failed');
    } catch (error: any) {
      alert(error?.message || 'An unknown error occurred');
      throw error;
    }
  }

  // Logout
  async logout() {
    try {
      // First clear the local state
      this.userSubject.next(null);
      
      // Then attempt to sign out from Supabase
      await this.supabaseService.signOut();
      
      // Navigate only after successful logout
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Logout error:', error);
      // Still navigate even if there's an error
      this.router.navigate(['/login']);
    }
  }

  // Add this method to your AuthService
  async getCurrentUser() {
    const session = await this.supabaseService.getSession();
    return session?.user || null;
  }
}
