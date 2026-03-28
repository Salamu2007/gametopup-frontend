import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GameService, OrderPayment, chargePayment } from '../../services/game.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-success.html',
  styleUrls: ['./payment-success.css'],
})
export class PaymentSuccess implements OnInit {
  loading = true;
  error: string | null = null;
  order: OrderPayment | null = null;
  charge: chargePayment | null = null;
  type: 'order' | 'charge' = 'order';
  id = '';

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    const type = this.route.snapshot.paramMap.get('type');
    const id = this.route.snapshot.paramMap.get('id');

    if (!type || !id) {
      this.error = 'رابط غير صالح لصفحة النجاح. تأكد من الرابط وحاول مرة أخرى.';
      this.loading = false;
      return;
    }

    this.type = type === 'charge' ? 'charge' : 'order';
    this.id = id;

    if (this.type === 'charge') {
      this.loadCharge(id);
    } else {
      this.loadOrder(id);
    }
  }

  get productName(): string {
    return this.order?.name || this.charge?.name || '—';
  }

  get price(): number {
    return this.order?.totalPrice || this.charge?.price || 0;
  }

  get customerEmail(): string {
    return this.order?.email || this.charge?.email || 'سيتم إعلامك في بريدك الإلكتروني';
  }

  loadOrder(id: string): void {
    this.loading = true;
    this.gameService.loadOrderPayment(id).subscribe({
      next: (data) => {
        this.order = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'فشل تحميل بيانات الطلب من الخادم.';
        this.loading = false;
      }
    });
  }

  loadCharge(id: string): void {
    this.loading = true;
    this.gameService.loadChargePayment(id).subscribe({
      next: (data) => {
        this.charge = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'فشل تحميل بيانات الشحن من الخادم.';
        this.loading = false;
      }
    });
  }
}
