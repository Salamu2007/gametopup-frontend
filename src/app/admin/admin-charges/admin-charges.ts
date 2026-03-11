import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminCharge } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-charges',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-charges.html',
  styleUrl: './admin-charges.css',
})
export class AdminCharges implements OnInit {
  charges: AdminCharge[] = [];
  allCharges: AdminCharge[] = [];
  selectedCharge: AdminCharge | null = null;
  isLoading = false;
  filterText = '';

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadCharges();
  }

  loadCharges() {
    this.isLoading = true;
    this.adminService.getCharges().subscribe({
      next: (data) => {
        this.charges = data.map((charge: any) => ({
          ...charge,
          gameImage: this.fixImageUrl(charge.gameImage)
        }));
        this.allCharges = [...this.charges];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading charges', err);
        this.isLoading = false;
      }
    });
  }

  private fixImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '/assets/images/comingsoon.png';
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/uploads/')) return `http://localhost:3000${imageUrl}`;
    return imageUrl;
  }

  searchCharges() {
    const term = this.filterText.trim().toLowerCase();
    if (term === '') {
      this.charges = [...this.allCharges];
      return;
    }
    this.charges = this.allCharges.filter(c =>
      (c.gameName || '').toLowerCase().includes(term) ||
      (c.email || '').toLowerCase().includes(term) ||
      (c.playerId || '').toLowerCase().includes(term)
    );
  }

  openCharge(charge: AdminCharge) {
    this.selectedCharge = charge;
  }

  closeModal() {
    this.selectedCharge = null;
  }

  approve() {
    if (!this.selectedCharge) return;
    this.adminService.confirmCharge(this.selectedCharge._id as string).subscribe({
      next: () => {
        alert('تم قبول الشحنة');
        this.closeModal();
        this.loadCharges();
      },
      error: (err) => {
        console.error('Approve error', err);
        alert('فشل قبول الشحنة');
      }
    });
  }

  reject() {
    if (!this.selectedCharge) return;
    this.adminService.rejectCharge(this.selectedCharge._id as string).subscribe({
      next: () => {
        alert('تم رفض الشحنة');
        this.closeModal();
        this.loadCharges();
      },
      error: (err) => {
        console.error('Reject error', err);
        alert('فشل رفض الشحنة');
      }
    });
  }
}
