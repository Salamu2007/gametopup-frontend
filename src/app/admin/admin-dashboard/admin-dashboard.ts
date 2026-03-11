import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminOrder, AdminService } from '../../services/admin.service';
import Chart from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-admin-dashboard',
  imports: [DatePipe,FormsModule,CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit, OnDestroy {
  totalOrders = 0;
  totalCharges = 0;
  totalGames = 0;
  latestOrders: any[] = [];
  notifications: string[] = [];
  orders: AdminOrder[] = [];
  isLoading = false;
  private lastOrderCount = 0;
  private lastChargeCount = 0;
  private pollInterval: any;
  private isInitialLoad = true;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.requestNotificationPermission();
    this.isLoading = true;
    this.loadDashboard();
    this.getOrders();
    // Poll every 10 seconds for new orders/charges
    this.pollInterval = setInterval(() => {
      this.checkForNewItems();
    }, 10000);
  }

  ngOnDestroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
          // Fallback: show in-page notification
          this.showInPageNotification('يرجى السماح بإشعارات المتصفح لرؤية التنبيهات الجديدة', 'warning');
        }
      });
    } else {
      console.log('Notifications not supported');
      this.showInPageNotification('متصفحك لا يدعم الإشعارات', 'error');
    }
  }

  showInPageNotification(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    this.notifications.push(`[${type.toUpperCase()}] ${message}`);
    // Remove after 10 seconds
    setTimeout(() => {
      this.notifications = this.notifications.filter(n => n !== `[${type.toUpperCase()}] ${message}`);
    }, 10000);
  }

  showNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: body,
        requireInteraction: true
      });
      notification.onclick = () => {
        notification.close();
      };
    }
  }

  testNotification() {
    this.showNotification('اختبار', 'هذا إشعار اختبار');
  }

  private fixImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '/assets/images/comingsoon.png';
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/uploads/')) return `http://localhost:3000${imageUrl}`;
    return imageUrl;
  }

  today = new Date();

  loadDashboard() {
    
    this.adminService.getDashboardData().subscribe({
      next: (data) => {
        const previousOrders = this.totalOrders;
        const previousCharges = this.totalCharges;

        this.totalOrders = data.totalOrders;
        this.totalCharges = data.totalCharges;
        this.totalGames = data.totalGames;
        this.latestOrders = data.latestOrders.map((order: any) => ({
          ...order,
          gameImage: this.fixImageUrl(order.gameImage)
        }));

        this.generateChart();

        // Only show notifications if not initial load
        if (!this.isInitialLoad) {
          // Check for new orders
          if (this.totalOrders > previousOrders) {
            this.showNotification('طلب جديد', `تم إضافة ${this.totalOrders - previousOrders} طلب جديد`);
            this.notifications.push(`📦 ${this.totalOrders - previousOrders} طلب جديد`);
          }

          // Check for new charges
          if (this.totalCharges > previousCharges) {
            this.showNotification('طلب شحن جديد', `تم إضافة ${this.totalCharges - previousCharges} طلب شحن جديد`);
            this.notifications.push(`🔋 ${this.totalCharges - previousCharges} طلب شحن جديد`);
          }
        } else {
          this.isInitialLoad = false;
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Dashboard error:', err);
        this.isLoading = false;
      }
    });
  }

  checkForNewItems() {
    this.adminService.getDashboardData().subscribe({
      next: (data) => {
        const previousOrders = this.totalOrders;
        const previousCharges = this.totalCharges;

        this.totalOrders = data.totalOrders;
        this.totalCharges = data.totalCharges;
        this.totalGames = data.totalGames;
        this.latestOrders = data.latestOrders.map((order: any) => ({
          ...order,
          gameImage: this.fixImageUrl(order.gameImage)
        }));

        // Check for new orders
        if (this.totalOrders > previousOrders) {
          this.showNotification('طلب جديد', `تم إضافة ${this.totalOrders - previousOrders} طلب جديد`);
          this.notifications.push(`📦 ${this.totalOrders - previousOrders} طلب جديد`);
        }

        // Check for new charges
        if (this.totalCharges > previousCharges) {
          this.showNotification('طلب شحن جديد', `تم إضافة ${this.totalCharges - previousCharges} طلب شحن جديد`);
          this.notifications.push(`🔋 ${this.totalCharges - previousCharges} طلب شحن جديد`);
        }
      },
      error: (err) => {
        console.error('Polling error:', err);
      }
    });
  }

  generateChart() {
    setTimeout(() => {
      new Chart("dashboardChart", {
        type: 'bar',
        data: {
          labels: ['الطلبات', 'الشحنات', 'الألعاب'],
          datasets: [{
            label: 'إحصائيات النظام',
            data: [this.totalOrders, this.totalCharges, this.totalGames],
            backgroundColor: ['#38bdf8', '#22c55e', '#a855f7']
          }]
        }
      });
    }, 300);
  }

  getOrders() {
    this.adminService.getOrders().subscribe({
      next: (res) => {
        console.log('Orders received:', res);
        this.orders = res && res.length > 0 ? res : this.getSampleOrders();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Orders error:', err);
        this.orders = this.getSampleOrders();
        this.isLoading = false;
      }
    });
  }

  getSampleOrders(): AdminOrder[] {
    return [
      {
        gameName: 'لعبة الأكشن',
        email: 'user1@example.com',
        quantity: 1,
        status: 'مكتمل',
        createdAt: new Date().toISOString(),
        gameImage: ''
      },
      {
        gameName: 'لعبة الألغاز',
        email: 'user2@example.com',
        quantity: 2,
        status: 'قيد الانتظار',
        createdAt: new Date().toISOString(),
        gameImage: ''
      },
      {
        gameName: 'لعبة المغامرات',
        email: 'user3@example.com',
        quantity: 1,
        status: 'مكتمل',
        createdAt: new Date().toISOString(),
        gameImage: ''
      }
    ];
  }
  
}
