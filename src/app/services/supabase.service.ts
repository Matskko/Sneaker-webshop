import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  public supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  onAuthChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  async getSession() {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session;
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any local storage or session data
      localStorage.removeItem('sb-' + environment.supabaseUrl + '-auth-token');
    } catch (error) {
      console.error('SignOut error:', error);
      // We'll just log the error but not throw it
      // This ensures the user can still log out even if the network request fails
    }
  }

  async getProducts() {
    try {
      console.log('Fetching products...');
      console.log('Supabase client:', this.supabase); // Check if client is initialized
      
      const { data, error } = await this.supabase
        .from('products')
        .select('*');
      
      console.log('Raw response:', { data, error });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('No data returned from Supabase');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    }
  }

  async getProfile(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // Ignore 'no rows returned' error
        throw error;
      }
      
      return data || null; // Return null if no profile exists
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  async updateProfile(profile: any) {
    try {
      const { error } = await this.supabase
        .from('profiles')
        .upsert({
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          gender: profile.gender,
          phone: profile.phone,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async getProductsByIds(ids: number[]) {
    try {
      if (!ids.length) return [];
      
      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .in('id', ids);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products by ids:', error);
      return [];
    }
  }
} 