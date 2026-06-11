import { Injectable } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';

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
  async handleError(
    error: unknown,
    fallbackMessage: string = 'A apărut o eroare.'
  ): Promise<string> {
    if (error instanceof HttpErrorResponse) {
      const responseBody: unknown = error.error;

      if (this.isErrorResponse(responseBody)) {
        return responseBody.error;
      }

      if (typeof responseBody === 'string' && responseBody.trim()) {
        return responseBody;
      }

      if (error.message) {
        return error.message;
      }
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return fallbackMessage;
  }

  private isErrorResponse(value: unknown): value is { error: string } {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    return (
      'error' in value &&
      typeof (value as { error?: unknown }).error === 'string'
    );
  }
}
