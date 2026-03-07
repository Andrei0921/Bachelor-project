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
      case 'Home':
        this.router.navigate(['/home']);
        break;
      case 'User':
        this.router.navigate(['/user']);
        break;
      case 'Lessons':
        this.router.navigate(['/lesson']);
        break;
      case 'Quizzes':
        this.router.navigate(['/quiz']);
        break;
      case '3d Model':
        this.router.navigate(['/model']);
        break;
      case 'Log out':
        this.tokenService.clear();
        this.router.navigate(['/login']);
        console.log('Logging out...');
        break;
    }
  }
}
