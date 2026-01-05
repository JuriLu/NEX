import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpClientMock: any;

  const mockUser: User = {
    id: 1,
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    username: 'testuser',
    role: UserRole.USER,
  };

  const authResponse = {
    access_token: 'valid-token',
    user: mockUser,
  };

  beforeEach(() => {
    httpClientMock = {
      get: vi.fn(),
      post: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [AuthService, { provide: HttpClient, useValue: httpClientMock }],
    });

    service = TestBed.inject(AuthService);

    // Mock localStorage
    const storage: { [key: string]: string } = {};
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, value: string) => (storage[key] = value),
      removeItem: (key: string) => delete storage[key],
      clear: () => {},
    });

    // Silence console.error globally for these tests as we test error paths
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and persist user', async () => {
      httpClientMock.post.mockReturnValue(of(authResponse));
      const setItemSpy = vi.spyOn(localStorage, 'setItem');

      const user = await firstValueFrom(service.login('test@example.com', 'password'));
      expect(user).toEqual({ ...mockUser, token: 'valid-token' });
      expect(setItemSpy).toHaveBeenCalled();
    });

    it('should handle login error with specific message', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Invalid credentials' },
        status: 401,
      });
      httpClientMock.post.mockReturnValue(throwError(() => errorResponse));

      try {
        await firstValueFrom(service.login('test@example.com', 'wrong'));
      } catch (err: any) {
        expect(err.message).toBe('Invalid credentials');
      }
    });

    it('should handle network error (status 0)', async () => {
      const errorResponse = new HttpErrorResponse({
        status: 0,
        statusText: 'Unknown Error',
        url: 'http://test.com',
      });
      httpClientMock.post.mockReturnValue(throwError(() => errorResponse));

      try {
        await firstValueFrom(service.login('test@example.com', 'pass'));
      } catch (err: any) {
        expect(err.message).toContain('reach the server');
      }
    });

    it('should handle validation errors as array', async () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: ['Invalid email', 'Password too short'] },
        status: 400,
      });
      httpClientMock.post.mockReturnValue(throwError(() => errorResponse));

      try {
        await firstValueFrom(service.login('bad', '123'));
      } catch (err: any) {
        expect(err.message).toBe('Invalid email, Password too short');
      }
    });

    it('should use fallback message when error body is empty', async () => {
      const errorResponse = new HttpErrorResponse({
        status: 500,
      });
      httpClientMock.post.mockReturnValue(throwError(() => errorResponse));

      try {
        await firstValueFrom(service.login('test@test.com', 'pass'));
      } catch (err: any) {
        expect(err.message).toBe('Invalid email or password.');
      }
    });

    it('should handle completely missing error object', async () => {
      httpClientMock.post.mockReturnValue(throwError(() => null));

      try {
        await firstValueFrom(service.login('test@test.com', 'pass'));
      } catch (err: any) {
        expect(err.message).toBe('Invalid email or password.');
      }
    });

    it('should handle error.error present but message missing', async () => {
      const errorResponse = new HttpErrorResponse({
        error: {},
        status: 400,
      });
      httpClientMock.post.mockReturnValue(throwError(() => errorResponse));

      try {
        await firstValueFrom(service.login('test@test.com', 'pass'));
      } catch (err: any) {
        expect(err.message).toBe('Invalid email or password.');
      }
    });
  });

  describe('logout', () => {
    it('should clear stored user', () => {
      const removeItemSpy = vi.spyOn(localStorage, 'removeItem');
      service.logout();
      expect(removeItemSpy).toHaveBeenCalledWith('auth_user');
    });
  });

  describe('register', () => {
    it('should register and login user', async () => {
      httpClientMock.post.mockReturnValue(of(mockUser));
      const loginSpy = vi
        .spyOn(service, 'login')
        .mockReturnValue(of({ ...mockUser, token: 'token' }));

      const user = await firstValueFrom(
        service.register({ email: 'test@example.com', password: 'password123' })
      );
      expect(loginSpy).toHaveBeenCalled();
      expect(user.token).toBe('token');
    });

    it('should fail if password is missing (buildRegistrationPayload failure)', async () => {
      try {
        await firstValueFrom(service.register({ email: 'test@example.com' }));
      } catch (err: any) {
        expect(err.message).toBe('Password is required.');
      }
    });

    it('should handle registration API error', async () => {
      httpClientMock.post.mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              error: { message: 'Email already exists' },
              status: 409,
            })
        )
      );

      try {
        await firstValueFrom(
          service.register({ email: 'existing@test.com', password: 'password123' })
        );
      } catch (err: any) {
        expect(err.message).toBe('Email already exists');
      }
    });
  });

  describe('checkUsernameUnique', () => {
    it('should return true if username is available', async () => {
      httpClientMock.get.mockReturnValue(of({ isAvailable: true }));

      const isAvailable = await firstValueFrom(service.checkUsernameUnique('newuser'));
      expect(isAvailable).toBe(true);
    });

    it('should return false if username is taken', async () => {
      httpClientMock.get.mockReturnValue(of({ isAvailable: false }));

      const isAvailable = await firstValueFrom(service.checkUsernameUnique('takenuser'));
      expect(isAvailable).toBe(false);
    });

    it('should return true for empty username without calling API', async () => {
      const isAvailable = await firstValueFrom(service.checkUsernameUnique(''));
      expect(isAvailable).toBe(true);
      expect(httpClientMock.get).not.toHaveBeenCalled();
    });

    it('should return true on API error (fallback)', async () => {
      httpClientMock.get.mockReturnValue(throwError(() => new Error('API Error')));

      const isAvailable = await firstValueFrom(service.checkUsernameUnique('user'));
      expect(isAvailable).toBe(true);
    });
  });

  describe('getCurrentUser', () => {
    it('should return null if no user in storage', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValue(null);
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should return user from storage', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(mockUser));
      expect(service.getCurrentUser()).toEqual(mockUser);
    });

    it('should return null and clear storage if JSON is malformed', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValue('malformed-json');
      const removeItemSpy = vi.spyOn(localStorage, 'removeItem');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const user = service.getCurrentUser();

      expect(user).toBeNull();
      expect(removeItemSpy).toHaveBeenCalledWith('auth_user');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
