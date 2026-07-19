import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';

  login(): void {
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        const route = response.user.role === 'admin' ? '/admin/dashboard' : '/user/home';
        this.router.navigateByUrl(route);
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
