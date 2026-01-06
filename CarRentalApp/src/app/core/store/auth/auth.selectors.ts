import { createFeatureSelector, createSelector } from '@ngrx/store';
import { User } from '../../models/user.model';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState): User | null => state.user
);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state: AuthState): boolean => !!state.user
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState): boolean => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState): string | null => state.error
);

export const selectIsAdmin = createSelector(
  selectAuthState,
  (state: AuthState): boolean => state.user?.role === 'admin'
);
