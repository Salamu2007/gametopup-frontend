import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const AdminGuard: CanActivateFn = () => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || role !== 'admin') {
    router.navigate(['/admin/login']);
    return false;
  }

  return true;
};