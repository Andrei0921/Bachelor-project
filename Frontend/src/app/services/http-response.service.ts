import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpResponseService {

  /**
   * Handles HTTP response that might be a Blob or regular JSON
   * @param response - HTTP response
   * @returns Promise that resolves to parsed JSON data
   */
  async handleResponse<T>(response: any): Promise<T> {
    return response as T;
  }

  /**
   * Handles HTTP error response
   * @param error - HTTP error
   * @param fallbackMessage - Fallback error message
   * @returns Promise that resolves to error message
   */
  async handleError(error: any, fallbackMessage: string = 'An error occurred'): Promise<string> {
    if (error?.error?.error) {
      return error.error.error;
    }

    if (typeof error?.error === 'string') {
      return error.error;
    }

    if (error?.message) {
      return error.message;
    }

    return fallbackMessage;
  }
}
