import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {TokenService} from '../services/token.service';

export const AuthGuard = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.getToken()) {
    return true;
  }

  return router.parseUrl('/login');
};
