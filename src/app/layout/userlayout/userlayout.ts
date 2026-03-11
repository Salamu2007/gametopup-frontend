import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-userlayout',
  imports: [RouterModule,Header,Footer],
  templateUrl: './userlayout.html',
  styleUrl: './userlayout.css',
})
export class Userlayout {

}
