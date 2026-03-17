import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { GameCard } from '../../services/game.service';
 
 @Component({
   selector: 'app-games',
   standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
   templateUrl: './games.html',
   styleUrls: ['./games.css'],
 })
 export class Games implements OnInit {
   products: GameCard[] = [];
   filteredProducts: GameCard[] = [];
   searchTerm: string = '';
   selectedPlatform: string = '';
   sortBy: string = 'newest';
   isLoading = false;
 
   constructor(private gameService: GameService) {}
 
   ngOnInit(): void {
     this.gameService.loadGamesCards().subscribe({
       next: (data) => {
          // ensure full url for images
          const apiHost = window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://gametopup-api.onrender.com';

          this.products = data.map(p => ({
            ...p,
            imageUrl: p.imageUrl && p.imageUrl.startsWith('/uploads/') ?
                       `${apiHost}${p.imageUrl}` : p.imageUrl
          }));
          this.filterProducts()
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
        }
     });
   }
 
   
 
   filterProducts() {
     this.filteredProducts = this.products.filter(p => {
       const matchesSearch = !this.searchTerm ||
         p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
         (p.description && p.description.toLowerCase().includes(this.searchTerm.toLowerCase()));

       const matchesPlatform = !this.selectedPlatform ||
         (p.platform && p.platform.toLowerCase().includes(this.selectedPlatform.toLowerCase()));

       return matchesSearch && matchesPlatform;
     });

     this.sortProducts();
   }

   sortProducts() {
     switch (this.sortBy) {
       case 'price-asc':
         this.filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
         break;
       case 'price-desc':
         this.filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
         break;
       case 'popular':
         this.filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
         break;
       case 'newest':
       default:
         this.filteredProducts.sort((a, b) => (b.is_New ? 1 : 0) - (a.is_New ? 1 : 0));
     }
   }

   resetFilters() {
     this.searchTerm = '';
     this.selectedPlatform = '';
     this.sortBy = 'newest';
     this.filterProducts();
   }
 }
