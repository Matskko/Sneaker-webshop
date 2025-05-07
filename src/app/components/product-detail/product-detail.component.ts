import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CartService, Product } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute, 
    private cartService: CartService
  ) {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    // TODO: Replace with actual product service
    this.product = {
      id: productId,
      name: 'Sample Product',
      price: 99.99,
      image: 'assets/sample.jpg'
    };
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product);
    }
  }
}
