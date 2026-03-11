import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  username = '';
  password = '';
  gameService: GameService;

  constructor(gameService: GameService) {
    this.gameService = gameService;
  }

  login() {
    // TODO: call backend service to authenticate admin
    this.gameService.makeAdminLogin(this.username, this.password).subscribe(
      (res) => {
        console.log('Login successful:', res);
        // Store token and role in localStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', 'admin');
        // Redirect to admin dashboard
        window.location.href = '/admin/dashboard';
      },
      (error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials and try again.');
      }
    );
  }

  
}
