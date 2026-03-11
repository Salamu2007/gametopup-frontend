import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  games = [
    { name: 'Fortnite', route: 'vbucks' ,image : 'assets/images/fortnite.png'},
    { name: 'Valorant', route: 'VB' ,image : 'assets/images/valorant.png'},
    { name: 'Roblox', route: 'robux' ,image : 'assets/images/roblox.png'},
    { name: 'Free Fire', route: 'diamonds' ,image : 'assets/images/freefire.png'},
    { name: 'CallOfDuty Mobile', route: 'CB' ,image : 'assets/images/codmobile.png'},
    { name: 'Fc Mobile', route: 'fc point' ,image : 'assets/images/fcmobile.png'},
    { name: 'efootball', route: 'coins' ,image : 'assets/images/efootball.png'},
    { name: 'PUBG Mobile', route: 'UC' ,image : 'assets/images/pubgmobile.png'},
  ];

  sellGames = [
    { name: 'Minecraft', route: 'for PC' ,image : 'assets/images/Minecraft.png'},
    { name: 'GTA V', route: 'For PC' ,image : 'assets/images/gta5.png'},
    { name: 'Red Dead Redemption 2', route: 'For PC' ,image : 'assets/images/rdr2.png'},
    { name: 'EA Sports FC 24', route: 'For PC' ,image : 'assets/images/fc24.png'},
    { name: 'EA Sports FC 25', route: 'For PC' ,image : 'assets/images/fc25.png'},
    { name: 'Cyberpunk 2077', route: 'For PC' ,image : 'assets/images/cyperbank2077.png'},
    { name: 'The Witcher 3', route: 'For PC' ,image : 'assets/images/the witcher 3.png'},

  ];
}
