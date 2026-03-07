import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'jwt';
  private readonly CURRENT_USER_KEY = 'currentUser';

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
      // Silent fail in production - could be enhanced with proper logging service
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
  /**
   * Clears all authentication data from localStorage
   */
  clear(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.CURRENT_USER_KEY);
    } catch (error) {
      // Silent fail in production
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
  private parseTokenPayload(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length < 2) {
        throw new Error('Invalid token format');
      }

      // Decode base64url encoded payload
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(payload);

      return JSON.parse(decodedPayload);
    } catch (error) {
      return null;
    }
  }
}
