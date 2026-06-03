import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

export interface AdminBanner {
  _id?: string;
  title: string;
  subtitle?: string;
  linkUrl?: string;
  ctaText?: string;
  imageUrl: string;
  imagePublicId?: string;
  sortOrder: number;
  isActive: boolean;
}

@Component({
  selector: 'app-admin-banners',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-banners.html',
  styleUrl: './admin-banners.css',
})
export class AdminBanners implements OnInit {
  banners: AdminBanner[] = [];
  isLoading = false;
  showForm = false;
  formTitle = 'إضافة بانر جديد';
  editingId: string | null = null;
  uploadingImage = false;
  imagePreview: string | null = null;

  formData: AdminBanner = this.getEmptyForm();

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadBanners();
  }

  loadBanners() {
    this.isLoading = true;
    this.adminService.getBanners().subscribe({
      next: (data) => {
        this.banners = (data || []).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading banners:', err);
        this.isLoading = false;
      }
    });
  }

  openAddForm() {
    this.formTitle = 'إضافة بانر جديد';
    this.editingId = null;
    this.formData = this.getEmptyForm();
    this.showForm = true;
    this.imagePreview = null;
  }

  openEditForm(banner: AdminBanner) {
    this.editingId = banner._id || null;
    this.formTitle = 'تعديل بانر';
    this.formData = { ...banner };
    this.showForm = true;
    this.imagePreview = this.resolveImageUrl(banner.imageUrl);
  }

  closeForm() {
    this.showForm = false;
    this.formData = this.getEmptyForm();
    this.editingId = null;
    this.imagePreview = null;
  }

  onImageSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    this.uploadingImage = true;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);

    this.adminService.uploadBannerImage(file).subscribe({
      next: (response) => {
        this.formData.imageUrl = response.imageUrl;
        this.formData.imagePublicId = response.imagePublicId;
        this.uploadingImage = false;
      },
      error: (err) => {
        console.error('Error uploading banner image:', err);
        this.uploadingImage = false;
        alert('فشل تحميل صورة البانر');
      }
    });
  }

  submitForm() {
    if (!this.formData.title || !this.formData.imageUrl) {
      alert('يرجى كتابة عنوان البانر وتحميل الصورة');
      return;
    }

    if (this.editingId) {
      this.adminService.updateBanner(this.editingId, this.formData).subscribe({
        next: () => {
          this.loadBanners();
          this.closeForm();
          alert('تم تحديث البانر بنجاح');
        },
        error: (err) => {
          console.error('Error updating banner:', err);
          alert('فشل تحديث البانر');
        }
      });
    } else {
      this.adminService.createBanner(this.formData).subscribe({
        next: () => {
          this.loadBanners();
          this.closeForm();
          alert('تم إضافة البانر بنجاح');
        },
        error: (err) => {
          console.error('Error creating banner:', err);
          alert('فشل إضافة البانر');
        }
      });
    }
  }

  deleteBanner(id?: string) {
    if (!id) return;
    if (!confirm('هل تريد حذف هذا البانر؟')) return;

    this.adminService.deleteBanner(id).subscribe({
      next: () => {
        this.loadBanners();
        alert('تم حذف البانر بنجاح');
      },
      error: (err) => {
        console.error('Error deleting banner:', err);
        alert('فشل حذف البانر');
      }
    });
  }

  toggleActive(banner: AdminBanner) {
    const updated = { isActive: !banner.isActive };
    this.adminService.updateBanner(banner._id as string, updated).subscribe({
      next: () => {
        banner.isActive = !banner.isActive;
      },
      error: (err) => {
        console.error('Error toggling banner active state:', err);
        alert('فشل تغيير حالة البانر');
      }
    });
  }

  moveBanner(banner: AdminBanner, direction: 'up' | 'down') {
    const index = this.banners.findIndex(item => item._id === banner._id);
    if (index < 0) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= this.banners.length) return;

    const targetBanner = this.banners[targetIndex];
    const originalOrder = banner.sortOrder;
    banner.sortOrder = targetBanner.sortOrder;
    targetBanner.sortOrder = originalOrder;

    this.adminService.updateBanner(banner._id as string, { sortOrder: banner.sortOrder }).subscribe({
      next: () => {
        this.adminService.updateBanner(targetBanner._id as string, { sortOrder: targetBanner.sortOrder }).subscribe({
          next: () => this.loadBanners(),
          error: (err) => console.error('Error saving target banner order:', err)
        });
      },
      error: (err) => {
        console.error('Error moving banner:', err);
      }
    });
  }

  saveOrder(banner: AdminBanner) {
    this.adminService.updateBanner(banner._id as string, { sortOrder: banner.sortOrder }).subscribe({
      next: () => {
        this.loadBanners();
      },
      error: (err) => {
        console.error('Error saving banner order:', err);
      }
    });
  }

  resolveImageUrl(imageUrl?: string): string | null {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    const apiHost = window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://gametopup-api.onrender.com';
    return `${apiHost}${imageUrl}`;
  }

  private getEmptyForm(): AdminBanner {
    return {
      title: '',
      subtitle: '',
      linkUrl: '',
      ctaText: 'عرض الآن',
      imageUrl: '',
      imagePublicId: '',
      sortOrder: this.banners.length + 1,
      isActive: true
    };
  }
}
