import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements OnInit, OnDestroy {
  notifications: string[] = [];
  private pollInterval: any;
  private isInitialLoad = true;
  private totalOrders = 0;
  private totalCharges = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.requestNotificationPermission();
    this.loadDashboard();
    this.pollInterval = setInterval(() => {
      this.loadDashboard();
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
        if (permission !== 'granted') {
          this.showInPageNotification('يرجى السماح بإشعارات المتصفح لرؤية التنبيهات الجديدة', 'warning');
        }
      });
    } else {
      this.showInPageNotification('متصفحك لا يدعم الإشعارات', 'error');
    }
  }

  showInPageNotification(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    const note = `[${type.toUpperCase()}] ${message}`;
    this.notifications.push(note);
    setTimeout(() => {
      this.notifications = this.notifications.filter(n => n !== note);
    }, 10000);
  }

  showNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        requireInteraction: true
      });
      notification.onclick = () => notification.close();
    }
  }

  private loadDashboard() {
    this.adminService.getDashboardData().subscribe({
      next: (data) => {
        const previousOrders = this.totalOrders;
        const previousCharges = this.totalCharges;

        this.totalOrders = data.totalOrders;
        this.totalCharges = data.totalCharges;

        if (!this.isInitialLoad) {
          if (this.totalOrders > previousOrders) {
            const diff = this.totalOrders - previousOrders;
            this.showNotification('طلب جديد', `تم إضافة ${diff} طلب جديد`);
            this.notifications.push(`📦 ${diff} طلب جديد`);
          }
          if (this.totalCharges > previousCharges) {
            const diff = this.totalCharges - previousCharges;
            this.showNotification('طلب شحن جديد', `تم إضافة ${diff} طلب شحن جديد`);
            this.notifications.push(`🔋 ${diff} طلب شحن جديد`);
          }
        } else {
          this.isInitialLoad = false;
        }
      },
      error: (err) => {
        console.error('Dashboard polling error:', err);
      }
    });
  }
}
