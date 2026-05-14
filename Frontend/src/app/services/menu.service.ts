import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {TokenService} from './token.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private router: Router, private tokenService: TokenService) {}

  navigate(label: string) {
    switch (label) {
      case 'Acasa':
        this.router.navigate(['/home']);
        break;
      case 'User':
        this.router.navigate(['/user']);
        break;
      case 'Lecții':
        this.router.navigate(['/lesson']);
        break;
      case 'Quiz-uri':
        this.router.navigate(['/quiz']);
        break;
      case 'Model 3D':
        this.router.navigate(['/model']);
        break;
      case 'Profil':
        this.router.navigate(['/profile']);
        break;
      case 'Log Out':
        this.tokenService.clear();
        this.router.navigate(['/login']);
        console.log('Logging out...');
        break;
    }
  }
}
