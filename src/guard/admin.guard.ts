import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AdminService } from '../app/services/admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    const token = this.adminService.getToken();
    const authUser = localStorage.getItem('auth_user');
    let parsedUser: { role?: string } | null = null;

    if (authUser) {
      try {
        parsedUser = JSON.parse(authUser);
      } catch {
        parsedUser = null;
      }
    }

    if (token && parsedUser?.role === 'admin') {
      return true;
    }

    return this.router.createUrlTree(['/admin/login']);
  }
}
