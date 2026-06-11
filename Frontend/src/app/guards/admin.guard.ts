import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  const token = tokenService.getToken();
  if (!token || tokenService.isTokenExpired()) {
    tokenService.clear();
    return router.parseUrl('/login');
  }

  if (!tokenService.isAdmin()) {
    return router.parseUrl('/home');
  }

  return true;
};
