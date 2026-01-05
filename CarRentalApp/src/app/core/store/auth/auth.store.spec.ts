import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { User, UserRole } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import * as AuthActions from './auth.actions';
import { AuthEffects } from './auth.effects';
import { authReducer, AuthState, initialState } from './auth.reducer';
import * as AuthSelectors from './auth.selectors';

describe('Auth Store', () => {
  const mockUser: User = {
    id: 1,
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    username: 'testuser',
    role: UserRole.USER,
    token: 'test-token',
  };

  describe('Auth Reducer', () => {
    it('should return the initial state', () => {
      const action = { type: 'Unknown' } as any;
      const state = authReducer(initialState, action);
      expect(state).toBe(initialState);
    });

    it('should set loading to true on login action', () => {
      const action = AuthActions.login({ email: 'test@test.com', password: 'password' });
      const state = authReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set user and loading to false on loginSuccess action', () => {
      const action = AuthActions.loginSuccess({ user: mockUser });
      const state = authReducer(initialState, action);
      expect(state.user).toEqual(mockUser);
      expect(state.loading).toBe(false);
    });

    it('should set error and loading to false on loginFailure action', () => {
      const error = 'Invalid credentials';
      const action = AuthActions.loginFailure({ error });
      const state = authReducer(initialState, action);
      expect(state.error).toBe(error);
      expect(state.loading).toBe(false);
    });

    it('should clear user on logout action', () => {
      const loggedInState: AuthState = { ...initialState, user: mockUser };
      const action = AuthActions.logout();
      const state = authReducer(loggedInState, action);
      expect(state.user).toBeNull();
    });
  });

  describe('Auth Selectors', () => {
    const state: AuthState = {
      user: mockUser,
      loading: false,
      error: 'some error',
    };
    const rootState = { auth: state };

    it('should select the auth state', () => {
      const result = AuthSelectors.selectAuthState(rootState);
      expect(result).toEqual(state);
    });

    it('should select the user', () => {
      const result = AuthSelectors.selectUser(rootState);
      expect(result).toEqual(mockUser);
    });

    it('should select isLoggedIn', () => {
      const result = AuthSelectors.selectIsLoggedIn(rootState);
      expect(result).toBe(true);
    });

    it('should select loading', () => {
      const result = AuthSelectors.selectAuthLoading(rootState);
      expect(result).toBe(false);
    });

    it('should select error', () => {
      const result = AuthSelectors.selectAuthError(rootState);
      expect(result).toBe('some error');
    });

    it('should select isAdmin', () => {
      const adminUser = { ...mockUser, role: UserRole.ADMIN };
      const adminState = { auth: { ...state, user: adminUser } };
      const result = AuthSelectors.selectIsAdmin(adminState);
      expect(result).toBe(true);
    });
  });

  describe('Auth Effects', () => {
    let actions$: Observable<Action>;
    let effects: AuthEffects;
    let authService: any;
    let userService: any;
    let router: any;

    beforeEach(() => {
      authService = {
        login: vi.fn(),
        logout: vi.fn(),
        getCurrentUser: vi.fn(),
      };
      userService = {
        updateUser: vi.fn(),
      };
      router = {
        navigate: vi.fn(),
        navigateByUrl: vi.fn(),
        parseUrl: vi.fn().mockReturnValue({ queryParams: {} }),
        url: '/test',
      };

      TestBed.configureTestingModule({
        providers: [
          AuthEffects,
          provideMockActions(() => actions$),
          { provide: AuthService, useValue: authService },
          { provide: UserService, useValue: userService },
          { provide: Router, useValue: router },
          { provide: ActivatedRoute, useValue: { params: of({}) } },
        ],
      });

      effects = TestBed.inject(AuthEffects);
    });

    it('should dispatch loginSuccess on successful login', () => {
      const loginAction = AuthActions.login({ email: 'test@test.com', password: 'password' });
      const successAction = AuthActions.loginSuccess({ user: mockUser });

      actions$ = of(loginAction);
      authService.login.mockReturnValue(of(mockUser));

      effects.login$.subscribe((action) => {
        expect(action).toEqual(successAction);
      });
    });

    it('should dispatch loginFailure on failed login', () => {
      const loginAction = AuthActions.login({ email: 'test@test.com', password: 'password' });
      const errorMsg = 'Unauthorized';
      const failureAction = AuthActions.loginFailure({ error: errorMsg });

      actions$ = of(loginAction);
      authService.login.mockReturnValue(throwError(() => ({ message: errorMsg })));

      effects.login$.subscribe((action) => {
        expect(action).toEqual(failureAction);
      });
    });

    it('should dispatch loginSuccess on init if user is found', () => {
      const initAction = AuthActions.init();
      const successAction = AuthActions.loginSuccess({ user: mockUser });

      actions$ = of(initAction);
      authService.getCurrentUser.mockReturnValue(mockUser);

      effects.init$.subscribe((action) => {
        expect(action).toEqual(successAction);
      });
    });

    it('should navigate on loginSuccess', () => {
      const action = AuthActions.loginSuccess({ user: mockUser });
      actions$ = of(action);

      effects.loginSuccess$.subscribe();
      expect(router.navigate).toHaveBeenCalledWith(['/catalog']);
    });

    it('should navigate to admin on loginSuccess for admin', () => {
      const adminUser = { ...mockUser, role: UserRole.ADMIN };
      const action = AuthActions.loginSuccess({ user: adminUser });
      actions$ = of(action);

      effects.loginSuccess$.subscribe();
      expect(router.navigate).toHaveBeenCalledWith(['/admin']);
    });

    it('should navigate to login and call logout on logout action', () => {
      const action = AuthActions.logout();
      actions$ = of(action);

      effects.logout$.subscribe();
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });
});
