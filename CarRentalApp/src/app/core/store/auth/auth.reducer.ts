import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  error: string | null;
  loading: boolean;
}

export const initialState: AuthState = {
  user: null, // Initial state needs handling for localStorage/session persistence later
  error: null,
  loading: false,
};

export const authReducer = createReducer(
  initialState,
  on(
    AuthActions.login,
    (state: AuthState): AuthState => ({ ...state, loading: true, error: null })
  ),
  on(
    AuthActions.loginSuccess,
    (state: AuthState, { user }: { user: User; type: string }): AuthState => ({
      ...state,
      user,
      loading: false,
    })
  ),
  on(
    AuthActions.loginFailure,
    (state: AuthState, { error }: { error: string; type: string }): AuthState => ({
      ...state,
      error,
      loading: false,
    })
  ),
  on(AuthActions.logout, (state: AuthState): AuthState => ({ ...state, user: null })),
  on(AuthActions.updateUser, (state: AuthState): AuthState => ({ ...state, loading: true })),
  on(
    AuthActions.updateUserSuccess,
    (state: AuthState, { user }: { user: User; type: string }): AuthState => ({
      ...state,
      user,
      loading: false,
    })
  )
);
