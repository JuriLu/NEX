import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateUser),
      mergeMap(({ user }) =>
        this.userService.updateUser(user).pipe(
          map((updatedUser) => {
            // Backend might not return the token on update, so we must preserve it
            // from the original user object to avoid logging the user out.
              const finalUser = updatedUser ? { ...user, ...updatedUser } : { ...user };
            if (!finalUser.token && user.token) {
              finalUser.token = user.token;
            }
            return AuthActions.updateUserSuccess({ user: finalUser });
          }),
          tap(({ user: finalUser }) => {
            // Update local storage so session persists
            localStorage.setItem('auth_user', JSON.stringify(finalUser));
          }),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message || 'Update failed' }))
          ) // Reuse loginFailure or create separate action
        )
      )
    )
  );

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.init),
      map(() => {
        const user = this.authService.getCurrentUser();
        if (user) {
          return AuthActions.loginSuccess({ user });
        }
        return { type: 'NOOP' };
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((user) => AuthActions.loginSuccess({ user })),
          catchError((error) => of(AuthActions.loginFailure({ error: error.message })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user }) => {
          const urlTree = this.router.parseUrl(this.router.url);
          const returnUrl = urlTree.queryParams['returnUrl'];
          if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
          } else if (user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/catalog']);
          }
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );
}
