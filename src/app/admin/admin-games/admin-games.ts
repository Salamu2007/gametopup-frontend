import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

export interface Game {
  _id?: string;
  name: string;
  category: string;
  platform?: string;
  price?: number;
  stock?: number;
  currency?: string;
  image?: string;
  description?: string;
  genre?: string;
  rating?: number;
  type?: string; // 'game' or 'charge'
  package?: { amount: number; price: number }[];
}

@Component({
  selector: 'app-admin-games',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-games.html',
  styleUrl: './admin-games.css',
})
export class AdminGames implements OnInit {
  games: Game[] = [];
  isLoading = false;
  showForm = false;
  formTitle = 'إضافة لعبة جديدة';
  editingId: string | null = null;
  uploadingImage = false;
  imagePreview: string | null = null;

  formData: Game = this.getEmptyForm();
  categories = ['أكشن', 'مغامرة', 'ألغاز', 'رياضة', 'محاكاة', 'أخرى'];
  platforms = ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile'];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadGames();
  }

  loadGames() {
    this.isLoading = true;
    this.adminService.getGames().subscribe({
      next: (data) => {
        this.games = data || this.getSampleGames();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading games:', err);
        this.games = this.getSampleGames();
        this.isLoading = false;
      }
    });
  }

  openAddForm() {
    this.formData = this.getEmptyForm();
    this.editingId = null;
    this.formTitle = 'إضافة لعبة جديدة';
    this.showForm = true;
    this.imagePreview = null;
  }

  openEditForm(game: Game) {
    this.formData = { ...game };
    this.editingId = game._id || null;
    this.formTitle = 'تعديل اللعبة';
    this.showForm = true;
    this.imagePreview = game.image ? `http://localhost:3000${game.image}` : null;
  }

  closeForm() {
    this.showForm = false;
    this.formData = this.getEmptyForm();
    this.editingId = null;
    this.imagePreview = null;
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadingImage = true;
      
      // عرض معاينة الصورة
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);

      // تحميل الصورة
      this.adminService.uploadGameImage(file).subscribe({
        next: (response) => {
          this.formData.image = response.imageUrl;
          this.uploadingImage = false;
          console.log('Image uploaded successfully:', response);
        },
        error: (err) => {
          console.error('Error uploading image:', err);
          this.uploadingImage = false;
          alert('حدث خطأ في تحميل الصورة');
        }
      });
    }
  }

  submitForm() {
    if (!this.formData.name || !this.formData.category) {
      alert('يرجى ملء الحقول المطلوبة');
      return;
    }

    if (this.editingId) {
      this.updateGame();
    } else {
      this.addGame();
    }
  }

  addGame() {
    this.adminService.createGame(this.formData).subscribe({
      next: () => {
        this.loadGames();
        this.closeForm();
        alert('تمت إضافة اللعبة بنجاح');
      },
      error: (err) => {
        console.error('Error adding game:', err);
        alert('حدث خطأ في إضافة اللعبة');
      }
    });
  }

  updateGame() {
    if (!this.editingId) return;

    this.adminService.updateGame(this.editingId, this.formData).subscribe({
      next: () => {
        this.loadGames();
        this.closeForm();
        alert('تم تحديث اللعبة بنجاح');
      },
      error: (err) => {
        console.error('Error updating game:', err);
        alert('حدث خطأ في تحديث اللعبة');
      }
    });
  }

  deleteGame(id: string | undefined) {
    if (!id) return;

    if (!confirm('هل تريد بالفعل حذف هذه اللعبة؟')) {
      return;
    }

    this.adminService.deleteGame(id).subscribe({
      next: () => {
        this.loadGames();
        alert('تم حذف اللعبة بنجاح');
      },
      error: (err) => {
        console.error('Error deleting game:', err);
        alert('حدث خطأ في حذف اللعبة');
      }
    });
  }

  private getEmptyForm(): Game {
    return {
      name: '',
      category: '',
      platform: '',
      price: 0,
      stock: 0,
      currency: 'دج',
      description: '',
      genre: '',
      rating: 0,
      type: 'game',
      image: '',
      package: []
    };
  }

  addPackage() {
    if (!this.formData.package) this.formData.package = [];
    this.formData.package.push({ amount: 0, price: 0 });
  }

  removePackage(index: number) {
    if (!this.formData.package) return;
    this.formData.package.splice(index, 1);
  }

  private getSampleGames(): Game[] {
    return [
      {
        _id: '1',
        name: 'لعبة الأكشن الرائعة',
        category: 'أكشن',
        platform: 'PlayStation',
        price: 199,
        stock: 50,
        currency: 'دج',
        rating: 4.5
      },
      {
        _id: '2',
        name: 'لعبة الألغاز المشوقة',
        category: 'ألغاز',
        platform: 'PC',
        price: 99,
        stock: 100,
        currency: 'دج',
        rating: 4
      }
    ];
  }
}
