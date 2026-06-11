import {Injectable} from '@angular/core';

interface JwtPayload {
  sub?: string;
  email?: string;
  exp?: number;
  role?: string;
  roles?: string[];
  authorities?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'jwt';
  private readonly CURRENT_USER_KEY = 'currentUser';
  private readonly USER_ID_KEY = 'userId';

  /**
   * Sets the authentication token in localStorage
   * @param token - JWT token or null to remove
   */
  setToken(token: string | null): void {
    try {
      if (token && this.isValidTokenFormat(token)) {
        localStorage.setItem(this.TOKEN_KEY, token);
      } else if (token === null) {
        localStorage.removeItem(this.TOKEN_KEY);
      }
    } catch (error) {
      console.warn('Nu s-a putut salva sau șterge tokenul din localStorage.', error);
    }
  }

  setUserId(userId: number | null | undefined): void {
    try {
      if (userId === null || userId === undefined) {
        localStorage.removeItem(this.USER_ID_KEY);
        return;
      }

      localStorage.setItem(this.USER_ID_KEY, String(userId));
    } catch(error) {
      console.warn('Nu s-a putut salva sau șterge ID-ul utilizatorului din localStorage.', error);
    }
  }

  getUserId(): number | null {
    try {
      const rawUserId = localStorage.getItem(this.USER_ID_KEY);
      if (!rawUserId) return null;

      const userId = Number(rawUserId);
      return Number.isFinite(userId) ? userId : null;
    } catch {
      return null;
    }
  }

  /**
   * Gets the authentication token from localStorage
   * @returns JWT token or null if not found
   */
  getToken(): string | null {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      return token && this.isValidTokenFormat(token) ? token : null;
    } catch (error) {
      return null;
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.CURRENT_USER_KEY);
      localStorage.removeItem(this.USER_ID_KEY);
    } catch (error) {
      console.warn('Nu s-au putut șterge datele din localStorage.', error);
    }
  }

  /**
   * Extracts email from JWT token payload
   * @returns Email address or empty string if not found
   */
  getEmailFromToken(): string {
    const token = this.getToken();
    if (!token) {
      return '';
    }

    try {
      const payload = this.parseTokenPayload(token);
      return payload?.sub ?? payload?.email ?? '';
    } catch (error) {
      return '';
    }
  }

  /**
   * Checks if the token is expired
   * @returns boolean indicating if token is expired
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }

    try {
      const payload = this.parseTokenPayload(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return payload?.exp ? payload.exp <= currentTime : true;
    } catch (error) {
      return true;
    }
  }

  /**
   * Validates if token has correct JWT format
   * @param token - Token to validate
   * @returns boolean indicating if token format is valid
   */
  private isValidTokenFormat(token: string): boolean {
    if (!token) {
      return false;
    }

    const parts = token.split('.');
    return parts.length === 3;
  }

  /**
   * Parses JWT token payload
   * @param token - JWT token
   * @returns Parsed payload or null if parsing fails
   */
  private parseTokenPayload(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length < 2) {
        throw new Error('Invalid token format');
      }

      const encodedPayload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(encodedPayload);

      const parsedPayload = JSON.parse(decodedPayload) as unknown;
      if (typeof parsedPayload !== 'object' || parsedPayload === null) {
        return null;
      }

      const payload = parsedPayload as Record<string, unknown>;
      return {
        sub: typeof payload['sub'] === 'string' ? payload['sub'] : undefined,
        email: typeof payload['email'] === 'string' ? payload['email'] : undefined,
        exp: typeof payload['exp'] === 'number' ? payload['exp'] : undefined,
        role: typeof payload['role'] === 'string' ? payload['role'] : undefined,
        roles: Array.isArray(payload['roles'])
          ? payload['roles'].filter((role): role is string => typeof role === 'string')
          : undefined,
        authorities: Array.isArray(payload['authorities'])
          ? payload['authorities'].filter((role): role is string => typeof role === 'string')
          : undefined,
      };
    } catch (error) {
      return null;
    }
  }

  getDisplayNameFromToken(): string {
    const token = this.getToken();
    if (!token) return '';

    try {
      const payload = this.parseTokenPayload(token);
      const email = payload?.sub ?? payload?.email ?? '';

      if (email.includes('@')) {
        return email.split('@')[0];
      }

      return email;
    } catch {
      return '';
    }
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.parseTokenPayload(token);
    const roles = payload?.roles ?? payload?.authorities ?? (payload?.role ? [payload.role] : []);

    return roles.includes('ROLE_ADMIN') || roles.includes('ADMIN');
  }
}
