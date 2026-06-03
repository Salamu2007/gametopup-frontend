import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-userlayout',
  imports: [CommonModule, RouterOutlet, Header, Footer],
  templateUrl: './userlayout.html',
  styleUrl: './userlayout.css',
})
export class Userlayout {
}
