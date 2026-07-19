import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  email = '';
  password = '';
  errorMessage = '';

  register(): void {
    this.errorMessage = '';

    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        const route = response.user.role === 'admin' ? '/admin/dashboard' : '/user/home';
        this.router.navigateByUrl(route);
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
