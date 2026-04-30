import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred';

      if (typeof error.error === 'string') {
        message = error.error;
      } else if (error.error?.message) {
        message = error.error.message;
      } else if (error.error) {
        message =
          error.error.message ||
          error.error.error ||
          JSON.stringify(error.error);
      } else {
        message = error.message || 'An unexpected error occurred';
      }

      toastService.error(message);

      return throwError(() => ({
        status: error.status,
        error: error.error,
        message
      }));
    })
  );
};
