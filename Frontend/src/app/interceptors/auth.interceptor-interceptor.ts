import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {TokenService} from '../services/token.service';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  // Skip adding authorization header for auth endpoints and if no token
  if (!token || isAuthEndpoint(req.url)) {
    return next(req);
  }

  // Check if token is expired
  if (tokenService.isTokenExpired()) {
    tokenService.clear();
    return next(req);
  }

  // Clone request with authorization header
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

