import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface Testimonial {
  text: string;
  author: string;
  time: string;
  rating: number;
}

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  showScrollTop = false;
  

  testimonials: Testimonial[] = [
    {
      text: 'خدمة ممتازة جداً! شحنت عملاتي للعبة Fortnite وجاءت فوراً. الأسعار أرخص من أي منصة أخرى.',
      author: 'عمر الدوسري',
      time: 'منذ أسبوع',
      rating: 5,
    },
    {
      text: 'موقع موثوق جداً. استخدمت الخدمة أكثر من 10 مرات ولم تخيب توقعاتي. دعم العملاء رد على سؤالي في ثانية!',
      author: 'ليليا الحوطة',
      time: 'منذ يومين',
      rating: 5,
    },
    {
      text: 'أفضل منصة لشحن العملات. سهلة الاستخدام والأمان عالي جداً. ينصح به كل صحابي.',
      author: 'خالد المزروع',
      time: 'منذ 3 أيام',
      rating: 5,
    },
  ];

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.showScrollTop = (window && window.pageYOffset) ? window.pageYOffset > 300 : false;
  }

  scrollToTop(): void {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }
}
