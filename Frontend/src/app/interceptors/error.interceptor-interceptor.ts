import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // Handle string error responses
      if (typeof error.error === 'string') {
        return throwError(() => ({
          status: error.status,
          error: error.error,
          message: error.error
        }));
      }

      // Handle structured error responses with message property
      if (error.error?.message) {
        return throwError(() => ({
          status: error.status,
          error: error.error,
          message: error.error.message
        }));
      }

      // Handle other error objects
      if (error.error) {
        return throwError(() => ({
          status: error.status,
          error: error.error,
          message: error.error.message || error.error.error || JSON.stringify(error.error)
        }));
      }

      // Fallback for network errors or other cases
      return throwError(() => ({
        status: error.status,
        error: error.error,
        message: error.message || 'An unexpected error occurred'
      }));
    })
  );
};

