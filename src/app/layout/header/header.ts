import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, AuthUser } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isMenuOpen = false;
  currentUser: AuthUser | null = this.authService.getCurrentUser();

  constructor() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
    this.closeMenu();
  }
}
