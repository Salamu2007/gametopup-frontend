import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GameService } from '../../services/game.service';

interface UserOrder {
  _id: string;
  gameName: string;
  gameImage: string;
  quantity: number;
  totalPrice: number;
  paymentMethod: string;
  username: string;
  email: string;
  status: string;
  deliveredData?: any;
  createdAt: string;
}

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
})
export class MyOrdersComponent implements OnInit {
  private readonly gameService = inject(GameService);

  orders: UserOrder[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadMyOrders();
  }

  loadMyOrders(): void {
    this.isLoading = true;

    this.gameService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: () => {
        this.orders = [];
        this.isLoading = false;
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'waiting_verification':
        return 'قيد الانتظار';
      case 'paid':
      case 'completed':
        return 'مكتمل';
      case 'rejected':
        return 'مرفوض';
      default:
        return 'قيد الانتظار';
    }
  }

  copyDeliveredData(value: string): void {
    navigator.clipboard.writeText(value).then(() => {
      alert('تم نسخ الحساب');
    }).catch(() => {
      alert('تعذر نسخ الحساب');
    });
  }
}
