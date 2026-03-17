import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { GameDetailcharge } from '../../services/game.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-detail-charge-game',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './detail-charge-game.html',
  styleUrls: ['./detail-charge-game.css'],
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class DetailChargeGame implements OnInit {
  message: string = '';
  isLoading: boolean = false;
  selectedAmount: string = '';
  selectedPackage: { amount: number; price: number } | null = null;
  playerId: string = '';
  email: string = '';
  phone: string = '';
  paymentMethod: string = 'ccp';
  game: GameDetailcharge | null = null;
  showSuccessNotification: boolean = false;
  successTitle: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.gameService.loadGamecharge(id).subscribe({
        next: (data) => {
          this.game = data;
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  getImageUrl(): string {
    if (!this.game?.image) {
      return '/assets/images/default.png';
    }

    // If it's already a full URL, return as is
    if (this.game.image.startsWith('http')) {
      return this.game.image;
    }

    // Deploy host helper (matches backend host)
    const apiHost = window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://gametopup-api.onrender.com';

    // If it's a relative path starting with /uploads, make it full URL
    if (this.game.image.startsWith('/uploads/')) {
      return `${apiHost}${this.game.image}`;
    }

    // Otherwise, assume it's just the filename in uploads
    return `${apiHost}/uploads/${this.game.image}`;
  }

  /**
   * Load product by ID and verify it's a top-up game
   */
  

  onAmountChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedAmount = target.value;
    const amount = Number(this.selectedAmount);
    if (this.game?.package) {
      this.selectedPackage = this.game.package.find(p => p.amount === amount) || null;
    } else {
      this.selectedPackage = null;
    }
  }

  onPlayerIdInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.playerId = target.value;
  }

  get canBuy(): boolean {
    return this.selectedAmount !== '' && this.playerId.trim() !== '' && !!this.selectedPackage;
  }

  showNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: body,
        icon: '/assets/images/logo.png'
      });
      notification.onclick = () => {
        notification.close();
      };
    }
  }

  closeNotification() {
    this.showSuccessNotification = false;
  }

  buyNow(): void {
    if (!this.game || !this.selectedPackage || !this.canBuy) return;

    this.isLoading = true;
    const payload = {
      playerId: this.playerId,
      amount: this.selectedPackage.price, // price to pay
      quantity: this.selectedPackage.amount, // actual top-up quantity
      email: this.email,
      phone: this.phone,
      paymentMethod: this.paymentMethod,
      currencyType: this.game.currencyType || "UC"
    };

    this.gameService.createCharge(this.game!._id, payload).subscribe({
      next: (res: any) => {

        const chargeId = res._id; // 👈 نجيبو ID من الرد

        // Show success notification
        this.showNotification('تم إنشاء طلب الشحن بنجاح!', 'سيتم توجيهك إلى صفحة الدفع');
        
        // Show in-page notification
        this.successTitle = 'تم إنشاء طلب الشحن بنجاح!';
        this.successMessage = 'سيتم توجيهك إلى صفحة الدفع...';
        this.showSuccessNotification = true;

        this.message = '✅ تم إنشاء طلب الشحن بنجاح';
        this.isLoading = false;

        // Auto close after 3 seconds and navigate
        setTimeout(() => {
          this.closeNotification();
          this.router.navigate(['/user/charge-payment', chargeId]);
        }, 3000);

      },
      error: (err) => {
        console.error('Charge error', err);
        this.message = '❌ فشل إنشاء الطلب: ' + (err?.error?.message || 'خطأ غير متوقع');
        this.isLoading = false;
      }
    });
  }

  
}
