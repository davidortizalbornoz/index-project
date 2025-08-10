import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        // Interceptor para agregar headers CORS si es necesario
        (req, next) => {
          const modifiedReq = req.clone({
            setHeaders: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          return next(modifiedReq);
        }
      ])
    )
  ]
};
