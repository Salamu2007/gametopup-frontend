import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameService, GamesCharges, GameCard } from '../../services/game.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  chargeGames: GamesCharges[] = [];
  sellGames: GameCard[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadChargeGames();
    this.loadSellGames();
  }

  private fixImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '/assets/images/comingsoon.png';
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/uploads/')) return `http://localhost:3000${imageUrl}`;
    return imageUrl;
  }

  private loadChargeGames(): void {
    this.gameService.loadgamecharges().subscribe({
      next: (data) => {
        this.chargeGames = data.map(game => ({
          ...game,
          imageUrl: this.fixImageUrl(game.imageUrl)
        }));
      },
      error: (err) => {
        console.error('Error loading charge games:', err);
      }
    });
  }

  private loadSellGames(): void {
    this.gameService.loadGamesCards().subscribe({
      next: (data) => {
        this.sellGames = data.map(game => ({
          ...game,
          imageUrl: this.fixImageUrl(game.imageUrl)
        }));
      },
      error: (err) => {
        console.error('Error loading sell games:', err);
      }
    });
  }
}
