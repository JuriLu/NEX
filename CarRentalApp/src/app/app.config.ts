import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import Lara from '@primeng/themes/lara';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { reducers } from './core/store/app.state';

import { AuthEffects } from './core/store/auth/auth.effects';
import { BookingEffects } from './core/store/booking/booking.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore(reducers),
    provideEffects([AuthEffects, BookingEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    providePrimeNG({
        theme: {
            preset: Lara,
            options: {
                darkModeSelector: false,
                cssLayer: {
                   name: 'primeng',
                   order: 'tailwind-base, primeng, tailwind-utilities'
                }
            }
        }
    })
  ]
};
