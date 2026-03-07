import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  const token = tokenService.getToken?.() ?? localStorage.getItem('token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const payload = parseJwt(token);
  const roles: string[] =
    payload?.roles ??
    payload?.authorities ??
    (payload?.role ? [payload.role] : []);

  const isAdmin = roles.includes('ROLE_ADMIN') || roles.includes('ADMIN');

  if (!isAdmin) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};

function parseJwt(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}
