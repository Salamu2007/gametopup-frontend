import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminOrder } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {
  orders: AdminOrder[] = [];
  allOrders: AdminOrder[] = [];
  selectedOrder: AdminOrder | null = null;
  isLoading = false;
  filterText = '';

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.adminService.getOrders().subscribe({
      next: (data) => {
        this.orders = data.map((order: any) => ({
          ...order,
          gameImage: this.fixImageUrl(order.gameImage)
        }));
        this.allOrders = [...this.orders];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders', err);
        this.isLoading = false;
      }
    });
  }

  private fixImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '/assets/images/comingsoon.png';
    if (imageUrl.startsWith('http')) return imageUrl;

    // Use the deployed API host when not running locally
    const apiHost = window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://gametopup-api.onrender.com';

    if (imageUrl.startsWith('/uploads/')) return `${apiHost}${imageUrl}`;
    return imageUrl;
  }

  searchOrders() {
    const term = this.filterText.trim().toLowerCase();
    if (term === '') {
      this.orders = [...this.allOrders];
      return;
    }
    this.orders = this.allOrders.filter(o =>
      (o.gameName || '').toLowerCase().includes(term) ||
      (o.email || '').toLowerCase().includes(term)
    );
  }

  openOrder(order: AdminOrder) {
    this.selectedOrder = order;
  }

  closeModal() {
    this.selectedOrder = null;
  }

  approve() {
    if (!this.selectedOrder) return;
    
    this.adminService.confirmOrder(this.selectedOrder._id as string).subscribe({
      next: (response) => {
        alert('تم قبول الطلب');
        this.closeModal();
        this.loadOrders();
      },
      error: (err) => {
        console.error('Approve error:', err);
        alert('فشل قبول الطلب: ' + (err.error?.message || 'خطأ غير معروف'));
      }
    });
  }

  reject() {
    if (!this.selectedOrder) return;
    this.adminService.rejectOrder(this.selectedOrder._id as string).subscribe({
      next: () => {
        alert('تم رفض الطلب');
        this.closeModal();
        this.loadOrders();
      },
      error: (err) => {
        console.error('Reject error', err);
        alert('فشل رفض الطلب');
      }
    });
  }
}
