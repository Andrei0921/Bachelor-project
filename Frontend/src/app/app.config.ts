import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { Configuration } from './api'
import { routes } from './app.routes';
import {providePrimeNG} from 'primeng/config';
import LaraLightBlue from '@primeuix/themes/aura';
import {FormsModule} from '@angular/forms';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {AuthInterceptor} from './interceptors/auth.interceptor-interceptor';
import {ErrorInterceptor} from './interceptors/error.interceptor-interceptor';
import {provideAnimations} from '@angular/platform-browser/animations';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: LaraLightBlue,
        options: {
          darkModeSelector: null,
        }
      }
    }),
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          const token = localStorage.getItem('jwt');
          if (token) {
            req = req.clone({
              setHeaders: {Authorization: `Bearer ${token}`}
            });
          }
          return next(req);
        },
        AuthInterceptor,
        ErrorInterceptor
      ])
    ),
    {
      provide: Configuration,
      useFactory: () => new Configuration({
        accessToken: () => localStorage.getItem('jwt') ?? ''
      })
    },
    importProvidersFrom(FormsModule),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideAnimations(),
    importProvidersFrom(ToastModule),
    MessageService,

  ]
};
