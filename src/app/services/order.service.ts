import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { CartService, Product } from './cart.service';

export interface Order {
  id: number;
  user_id: string;
  items: Product[];
  total: number;
  status: string;
  created_at: string;
  shipping_address: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  async getOrders(): Promise<Order[]> {
    const user = await this.authService.getCurrentUser();
    if (!user) return [];

    try {
      const { data, error } = await this.supabaseService.supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  async createOrder(shippingAddress: string): Promise<boolean> {
    const user = await this.authService.getCurrentUser();
    if (!user) return false;

    const cart = this.cartService.getCart();
    if (cart.length === 0) return false;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    try {
      const { error } = await this.supabaseService.supabase
        .from('orders')
        .insert({
          user_id: user.id,
          items: cart,
          total,
          status: 'pending',
          shipping_address: shippingAddress
        });

      if (error) throw error;
      
      // Clear cart after successful order
      this.cartService.clearCart();
      return true;
    } catch (error) {
      console.error('Error creating order:', error);
      return false;
    }
  }
} 