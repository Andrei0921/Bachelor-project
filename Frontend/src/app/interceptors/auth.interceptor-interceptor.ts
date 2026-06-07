import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {TokenService} from '../services/token.service';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const token = tokenService.getToken();

  if (!token || isAuthEndpoint(req.url)) {
    return next(req);
  }

  if (tokenService.isTokenExpired()) {
    tokenService.clear();
    void router.navigate(['/login']);
    return next(req);
  }

  const authenticatedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authenticatedReq);
};

/**
 * Checks if the request URL is an authentication endpoint
 * @param url - Request URL
 * @returns boolean indicating if URL is an auth endpoint
 */
function isAuthEndpoint(url: string): boolean {
  return url.includes('/api/auth/');
}

