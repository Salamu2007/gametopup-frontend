import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GameService , OrderPayment , chargePayment} from '../../services/game.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.html',
  styleUrl: './payment.css',
  imports: [CommonModule, FormsModule],
})


export class Payment implements OnInit {
  order: OrderPayment | null = null;
  charge: chargePayment | null = null;
  loading = false;
  error: string | null = null;
  submitting = false;
  successMessage: string | null = null;
  type!: 'order' | 'charge';
  id!: string;

  // Fallback payment details if the order doesn't provide them
  paymentFallbacks: any = {
    ccp: {
      number: '123456789012345678',
      accountName: 'GameTopup DZ'
    },
    baridimob: {
      phone: '0550000000'
    },
    wise: {
      iban: 'FR76XXXXXXXXXXXX',
      accountName: 'GameTopup International'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;

    const currentUrl = this.router.url;

    console.log("Current URL:", currentUrl);

    if (currentUrl.includes('order-payment')) {
      this.type = 'order';
      this.loadOrder(this.id);
    } 
    else if (currentUrl.includes('charge-payment')) {
      this.type = 'charge';
      this.loadCharge(this.id);
    }
  }

  selectedFile!: File;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  get orderId(): string {
    return this.order?.orderId || '';
  }

  get paymentMethod(): string {
    return this.order?.paymentMethod || '';
  }

  get itemName(): string {
    return this.order?.name || '—';
  }

  get quantity(): number {
    return this.order?.quantity || 1;
  }

  get unitPrice(): number {
    // prefer stored unitPrice; fallback to product price or compute from total
    if (this.order?.unitPrice != null) {
      return this.order.unitPrice;
    }
    if (this.order?.price != null) {
      return this.order.price;
    }
    if (this.order?.totalPrice != null && this.order?.quantity) {
      return this.order.totalPrice / this.order.quantity;
    }
    return 0;
  }

  get totalPrice(): number {
    if (this.order?.totalPrice != null) {
      return this.order.totalPrice;
    }
    return this.unitPrice * this.quantity;
  }

  paymentDetails() {
    return this.paymentFallbacks[this.paymentMethod] || {};
  }


  loadOrder(id: string) {
    this.loading = true;

    this.gameService.loadOrderPayment(id).subscribe({
      next: (data) => {
        this.order = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'فشل تحميل الطلب';
        this.loading = false;
      }
    });
  }

  loadCharge(id: string) {
    this.loading = true;
    this.gameService.loadChargePayment(id).subscribe({
      next: (data) => {
        this.charge = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'فشل تحميل الطلب';
        this.loading = false;
      }
    });
  }

  confirm() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('proofImage', this.selectedFile);

    this.submitting = true;

    if (this.type === 'order') {
      this.gameService.confirmOrder(this.id, formData).subscribe({
        next: () => {
          this.successMessage = '✅ تم إرسال إثبات الدفع.';
          this.submitting = false;
        },
        error: () => {
          this.submitting = false;
        }
      });
    } else {
        this.gameService.confirmCharge(this.id, formData).subscribe({
        next: () => {
          this.successMessage = '✅ تم إرسال إثبات الدفع.';
          this.submitting = false;
        },
        error: (err : any) => {
          console.error(err);
        }
      });
    }

  }

  
  
}


