import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css'],
})
export class AdminLayout {
  private readonly router = inject(Router);
  notifications: string[] = [];

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_user');
    this.router.navigateByUrl('/admin/login');
  }
}
