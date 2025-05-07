import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Add this import
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';  // Add AuthService

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Add FormsModule here
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}  // Inject AuthService

  async register() {
    try {
      await this.authService.register(this.email, this.password);
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message || 'Registration failed');
    }
  }
}
