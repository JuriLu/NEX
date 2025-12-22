import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  // For now, if we have a user, attach a mock token.
  // In real app, we follow the token stream or get it from local storage.

  // Note: For cleaner Mock flow, we might just pass through if no user.
  // Mock backend doesn't validate tokens unless we configured it to.

  return next(req);
};
