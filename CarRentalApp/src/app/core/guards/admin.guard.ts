import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { User } from '../models/user.model';
import { selectUser } from '../store/auth/auth.selectors';

export const adminGuard: CanActivateFn = (route, state) => {
  const store: Store = inject(Store);
  const router: Router = inject(Router);

  return store.select(selectUser).pipe(
    take(1),
    map((user: User | null): boolean |UrlTree => {
      if (user?.role === 'admin') {
        return true;
      }
      // Redirect if not admin
      return router.createUrlTree(['/auth/login']);
    })
  );
};
