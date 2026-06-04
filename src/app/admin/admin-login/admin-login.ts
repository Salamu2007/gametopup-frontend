import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  username = '';
  password = '';

  constructor(
    private gameService: GameService,
    private router: Router
  ) {}

  login() {
    this.gameService.makeAdminLogin(this.username, this.password).subscribe({
      next: (res: any) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
        }
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        console.error('Admin login failed', err);
        alert('Login failed. Please try again.');
      }
    });
  }
}
