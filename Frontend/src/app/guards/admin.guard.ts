import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  const token = tokenService.getToken?.() ?? localStorage.getItem('token');
  if (!token || tokenService.isTokenExpired()) {
    tokenService.clear();
    return router.parseUrl('/login');
  }

  const payload = parseJwt(token);
  const rolesValue = payload?.['roles'] ?? payload?.['authorities'];
  const roles = Array.isArray(rolesValue)
    ? rolesValue.filter((role): role is string => typeof role === 'string')
    : typeof payload?.['role'] === 'string'
      ? [payload['role']]
      : [];

  const isAdmin = roles.includes('ROLE_ADMIN') || roles.includes('ADMIN');

  if (!isAdmin) {
    return router.parseUrl('/home');
  }

  return true;
};

function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      return null;
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(json) as unknown;
    return typeof payload === 'object' && payload !== null
      ? payload as Record<string, unknown>
      : null;
  } catch {
    return null;
  }
}
