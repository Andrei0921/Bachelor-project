import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {TokenService} from '../services/token.service';

export const landingGuard: CanActivateFn = () => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  if (!tokenService.getToken() || tokenService.isTokenExpired()) {
    tokenService.clear();
    return router.parseUrl('/login');
  }

  return router.parseUrl(tokenService.isAdmin() ? '/admin/quiz' : '/home');
};
