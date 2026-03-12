import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { GameService , GamesCharges} from '../../services/game.service';


interface FAQItem {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-charge-games',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './charge-games.html',
  styleUrl: './charge-games.css',
})
export class ChargeGames implements OnInit {
  activeCategory = 'popular';
  gameCategories = [
    { id: 'popular', name: 'الألعاب الشهيرة 🔥' },
    { id: 'mobile', name: 'تطبيقات موبايل 📱' },
    { id: 'console', name: 'العاب الأجهزة 🎮' },
    { id: 'pc', name: 'ألعاب الكمبيوتر 💻' },
  ];

  games: GamesCharges[] = [];

  faqItems: FAQItem[] = [
    {
      question: 'كم الوقت المطلوب لاستقبال العملات؟',
      answer:
        'جميع الشحنات فورية! ستستقبل عملاتك خلال دقائق معدودة من تأكيد الدفع.',
      open: false,
    },
    {
      question: 'هل الشحن آمن؟',
      answer:
        'نعم، نستخدم تقنيات التشفير الحديثة وبوابات دفع آمنة معتمدة دولياً. بيانات حسابك محمية بالكامل.',
      open: false,
    },
    {
      question: 'ماذا إذا لم أستقبل العملات؟',
      answer:
        'في حالة عدم استقبال العملات، يمكنك التواصل مع فريق الدعم الخاص بنا وسنعيد المبلغ أو نأكمل الشحن.',
      open: false,
    },
    {
      question: 'ما طرق الدفع المتاحة؟',
      answer:
        'نقبل جميع طرق الدفع الرئيسية: بطاقات الائتمان والخصم، التحويل البنكي، محافظ رقمية، وتحويل الأموال.',
      open: false,
    },
    {
      question: 'هل هناك حد أدنى أو أقصى للشحن؟',
      answer:
        'الحد الأدنى للشحن 10 ريال والحد الأقصى 1000 ريال. يمكنك شحن عدة مرات بدون مشكلة.',
      open: false,
    },
    {
      question: 'هل تقدمون خدمات للشركات؟',
      answer:
        'نعم، نقدم خدمات خاصة للشركات والمتاجر. تواصل معنا للحصول على عروض خاصة.',
      open: false,
    },
  ];

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.loadgamecharges().subscribe({
      next: (data) => {
        this.games = data;
      },
      error: (error) => {
        console.error('Error loading games:', error);
      }
    });
  }
}
