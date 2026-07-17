import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameService, GamesCharges, GameCard, Banner } from '../../services/game.service';
import { RouterModule } from '@angular/router';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas', { static: true })
  private particleCanvas!: ElementRef<HTMLCanvasElement>;

  chargeGames: GamesCharges[] = [];
  sellGames: GameCard[] = [];
  banners: Banner[] = [];
  currentBannerIndex = 0;
  private bannerInterval: any;
  private readonly autoplayDelay = 5000;

  private canvasCtx: CanvasRenderingContext2D | null = null;
  private canvasWidth = 0;
  private canvasHeight = 0;
  private particles: Particle[] = [];
  private animationFrameId = 0;
  private pointer = { x: 0, y: 0, active: false };

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadBanners();
    this.loadChargeGames();
    this.loadSellGames();
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.startCanvasAnimation();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.resizeCanvas();
  }

  onPagePointerMove(event: PointerEvent): void {
    const rect = this.particleCanvas.nativeElement.getBoundingClientRect();
    this.pointer.x = (event.clientX - rect.left) / rect.width;
    this.pointer.y = (event.clientY - rect.top) / rect.height;
    this.pointer.active = true;
  }

  resetPagePointer(): void {
    this.pointer.active = false;
  }

  onCardPointerMove(event: PointerEvent): void {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    const rotateY = (offsetX / rect.width) * 14;
    const rotateX = -(offsetY / rect.height) * 14;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    card.style.transition = 'transform 0.12s ease-out';
  }

  resetCardTransform(event: Event): void {
    const card = event.currentTarget as HTMLElement;
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)';
  }

  private fixImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '/assets/images/comingsoon.png';
    if (imageUrl.startsWith('http')) return imageUrl;

    const apiHost =
      window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://gametopup-api.onrender.com';

    if (imageUrl.startsWith('/uploads/')) return `${apiHost}${imageUrl}`;
    return imageUrl;
  }

  private loadChargeGames(): void {
    this.gameService.loadgamecharges().subscribe({
      next: (data) => {
        this.chargeGames = data.map((game) => ({
          ...game,
          imageUrl: this.fixImageUrl(game.imageUrl),
        }));
      },
      error: (err) => {
        console.error('Error loading charge games:', err);
      },
    });
  }

  private loadBanners(): void {
    this.gameService.loadBanners().subscribe({
      next: (data) => {
        this.banners = data
          .filter((banner) => banner.isActive)
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
          .map((banner) => ({
            ...banner,
            imageUrl: this.fixImageUrl(banner.imageUrl),
          }));

        if (this.banners.length > 0) {
          this.startAutoplay();
        }
      },
      error: (err) => {
        console.error('Error loading banners:', err);
      },
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
        this.sellGames = data.map((game) => ({
          ...game,
          imageUrl: this.fixImageUrl(game.imageUrl),
        }));
      },
      error: (err) => {
        console.error('Error loading sell games:', err);
      },
    });
  }

  private initializeCanvas(): void {
    const canvas = this.particleCanvas.nativeElement;
    this.canvasCtx = canvas.getContext('2d');
    this.resizeCanvas();
    this.particles = Array.from({ length: 28 }, () => this.createParticle());
  }

  private resizeCanvas(): void {
    const canvas = this.particleCanvas.nativeElement;
    this.canvasWidth = canvas.width = canvas.offsetWidth;
    this.canvasHeight = canvas.height = canvas.offsetHeight;
  }

  private startCanvasAnimation(): void {
    this.animationFrameId = window.requestAnimationFrame(() => this.animateCanvas());
  }

  private stopCanvasAnimation(): void {
    window.cancelAnimationFrame(this.animationFrameId);
  }

  private animateCanvas(): void {
    if (!this.canvasCtx) return;

    this.canvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    const pointerX = this.pointer.active ? this.pointer.x * this.canvasWidth : this.canvasWidth / 2;
    const pointerY = this.pointer.active ? this.pointer.y * this.canvasHeight : this.canvasHeight / 2;

    for (const particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -particle.radius) particle.x = this.canvasWidth + particle.radius;
      if (particle.x > this.canvasWidth + particle.radius) particle.x = -particle.radius;
      if (particle.y < -particle.radius) particle.y = this.canvasHeight + particle.radius;
      if (particle.y > this.canvasHeight + particle.radius) particle.y = -particle.radius;

      const dx = pointerX - particle.x;
      const dy = pointerY - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / (this.canvasWidth * 0.35));

      particle.alpha = 0.35 + influence * 0.45;
      particle.vx += (dx / this.canvasWidth) * 0.03 * influence;
      particle.vy += (dy / this.canvasHeight) * 0.03 * influence;
      particle.vx *= 0.98;
      particle.vy *= 0.98;

      this.drawParticle(particle);
    }

    this.drawConnections();
    this.animationFrameId = window.requestAnimationFrame(() => this.animateCanvas());
  }

  private drawParticle(particle: Particle): void {
    if (!this.canvasCtx) return;

    this.canvasCtx.beginPath();
    this.canvasCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    this.canvasCtx.fillStyle = `rgba(138, 180, 248, ${particle.alpha})`;
    this.canvasCtx.fill();
  }

  private drawConnections(): void {
    if (!this.canvasCtx) return;

    this.canvasCtx.strokeStyle = 'rgba(138, 180, 248, 0.12)';
    this.canvasCtx.lineWidth = 1;

    for (let i = 0; i < this.particles.length; i += 1) {
      for (let j = i + 1; j < this.particles.length; j += 1) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          this.canvasCtx.globalAlpha = 0.18 - distance / 120 * 0.15;
          this.canvasCtx.beginPath();
          this.canvasCtx.moveTo(this.particles[i].x, this.particles[i].y);
          this.canvasCtx.lineTo(this.particles[j].x, this.particles[j].y);
          this.canvasCtx.stroke();
          this.canvasCtx.globalAlpha = 1;
        }
      }
    }
  }

  private createParticle(): Particle {
    return {
      x: Math.random() * this.canvasWidth || 0,
      y: Math.random() * this.canvasHeight || 0,
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.24,
      radius: 1.5 + Math.random() * 2.5,
      alpha: 0.2 + Math.random() * 0.35,
    };
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
    this.stopCanvasAnimation();
  }
}
