import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ Import RouterModule for routing
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // ✅ Fixed typo 'styleUrl' to 'styleUrls'
})
export class AppComponent {
  title = 'angular-website';

  constructor(
    public cartService: CartService,
    public authService: AuthService,
    public notificationService: NotificationService
  ) {}

  async logout(event: Event) {
    event.preventDefault(); // Prevent default link behavior
    await this.authService.logout();
  }
}
