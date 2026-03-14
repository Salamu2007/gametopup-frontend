import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GameService, GameDetailbuy } from '../../services/game.service';
import { trigger, transition, style, animate } from '@angular/animations';

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
  game: GameDetailbuy | null = null;
  quantity: number = 1;
  email: string = '';
  phone: string = '';
  paymentMethod: string = 'ccp';
  isLoading: boolean = false;
  message: string = '';
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
      if (!this.game) return '/assets/images/comingsoon.png';
      const img = this.game.image || '';
      
      // إذا كانت صورة مرفوعة من backend
      if (img.includes('/uploads/') || img.includes('localhost:3000')) {
        return img.startsWith('http') ? img : `http://localhost:3000${img}`;
      }
      
      // إذا كانت موارد محلية
      if (img.startsWith('http') || img.startsWith('/assets') || img.startsWith('assets')) {
        return img.startsWith('/') ? img : '/' + img;
      }
      
      // افتراضياً استخدم assets
      const file = img.split('/').pop() || 'comingsoon.png';
      return `/assets/images/${file}`;
    }


  get canBuy(): boolean {
    return !!this.game && this.quantity > 0 && this.email.trim() !== '' && this.phone.trim() !== '';
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
      phone: this.phone
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
