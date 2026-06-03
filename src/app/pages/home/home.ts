import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameService, GamesCharges, GameCard, Banner } from '../../services/game.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit, OnDestroy {
  chargeGames: GamesCharges[] = [];
  sellGames: GameCard[] = [];
  banners: Banner[] = [];
  currentBannerIndex = 0;
  private bannerInterval: any;
  private readonly autoplayDelay = 5000;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadBanners();
    this.loadChargeGames();
    this.loadSellGames();
  }

  private fixImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '/assets/images/comingsoon.png';
    if (imageUrl.startsWith('http')) return imageUrl;

    const apiHost = window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://gametopup-api.onrender.com';

    if (imageUrl.startsWith('/uploads/')) return `${apiHost}${imageUrl}`;
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

  private loadBanners(): void {
    this.gameService.loadBanners().subscribe({
      next: (data) => {
        this.banners = data
          .filter(banner => banner.isActive)
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
          .map(banner => ({
            ...banner,
            imageUrl: this.fixImageUrl(banner.imageUrl)
          }));

        if (this.banners.length > 0) {
          this.startAutoplay();
        }
      },
      error: (err) => {
        console.error('Error loading banners:', err);
      }
    });
  }

  private startAutoplay(): void {
    this.stopAutoplay();
    this.bannerInterval = setInterval(() => {
      this.nextBanner();
    }, this.autoplayDelay);
  }

  private stopAutoplay(): void {
    if (this.bannerInterval) {
      clearInterval(this.bannerInterval);
      this.bannerInterval = null;
    }
  }

  previousBanner(): void {
    if (!this.banners.length) return;
    this.currentBannerIndex = (this.currentBannerIndex - 1 + this.banners.length) % this.banners.length;
    this.restartAutoplay();
  }

  nextBanner(): void {
    if (!this.banners.length) return;
    this.currentBannerIndex = (this.currentBannerIndex + 1) % this.banners.length;
  }

  selectBanner(index: number): void {
    this.currentBannerIndex = index;
    this.restartAutoplay();
  }

  private restartAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
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

  ngOnDestroy(): void {
    this.stopAutoplay();
  }
}
