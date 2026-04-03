import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GameService } from '../../services/game.service';
import { trigger, transition, style, animate } from '@angular/animations';

export interface Field {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

export interface GameDetailbuyLocal {
  _id: string;
  name: string;
  category?: string;
  platform?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency?: string;
  currencyType?: string;
  stock?: number;
  image?: string;
  description?: string;
  genre?: string;
  rating?: number;
  reviews?: number;
  type?: string;
  package?: { amount: number; price: number }[];
  fields?: Field[];
}

@Component({
  selector: 'app-detail-buy-game',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './detail-buy-game.html',
  styleUrls: ['./detail-buy-game.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class DetailBuyGame implements OnInit {
  game: GameDetailbuyLocal | null = null;
  quantity: number = 1;
  email: string = '';
  fallbackImage: string = '/assets/images/comingsoon.png';
  phone: string = '';
  paymentMethod: string = 'ccp';
  isLoading: boolean = false;
  message: string = '';
  showSuccessNotification: boolean = false;
  successTitle: string = '';
  successMessage: string = '';
  dynamicData: { [key: string]: any } = {};

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadGame(id);
  }

  loadGame(id: string): void {
    this.isLoading = true;
    this.gameService.loadGamebuy(id).subscribe({
      next: (data) => {
        this.game = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load game:', err);
        this.message = '❌ فشل تحميل بيانات اللعبة.';
        this.isLoading = false;
      }
    });
  }

    getImageUrl(): string {
      const img = this.game?.image || '';
      if (!img) {
        return this.fallbackImage;
      }

      if (img.startsWith('http://') || img.startsWith('https://')) {
        return img;
      }

      return this.fallbackImage;
    }

    onImageError(event: Event): void {
      const target = event.target as HTMLImageElement;
      if (target) {
        target.src = this.fallbackImage;
      }
    }


  get canBuy(): boolean {
    if (!this.game || this.quantity <= 0 || this.email.trim() === '' || this.phone.trim() === '') {
      return false;
    }

    // Check required dynamic fields
    if (this.game.fields) {
      for (const field of this.game.fields) {
        if (field.required) {
          const value = this.dynamicData[field.name];
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            return false;
          }
        }
      }
    }

    return true;
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

  buy() {
    if (!this.game?._id) return;

    this.isLoading = true;

    const payload = {
      quantity: this.quantity,
      paymentMethod: this.paymentMethod,
      email: this.email,
      phone: this.phone,
      dynamicData: this.dynamicData
    };

    this.gameService.createOrder(this.game._id, payload).subscribe({
      next: (res: any) => {

        const orderId = res._id;

        // Show success notification
        this.showNotification('تم إنشاء الطلب بنجاح!', 'سيتم توجيهك إلى صفحة الدفع');
        
        // Show in-page notification
        this.successTitle = 'تم إنشاء الطلب بنجاح!';
        this.successMessage = 'سيتم توجيهك إلى صفحة الدفع...';
        this.showSuccessNotification = true;

        // Auto close after 3 seconds and navigate
        setTimeout(() => {
          this.closeNotification();
          this.router.navigate(['/user/order-payment', orderId]);
        }, 3000);

        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}
