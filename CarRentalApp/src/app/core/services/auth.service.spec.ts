import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
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
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and persist user', () => {
      httpClientMock.post.mockReturnValue(of(authResponse));
      const setItemSpy = vi.spyOn(localStorage, 'setItem');

      service.login('test@example.com', 'password').subscribe((user) => {
        expect(user).toEqual({ ...mockUser, token: 'valid-token' });
        expect(setItemSpy).toHaveBeenCalled();
      });
    });

    it('should handle login error', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Invalid credentials' },
        status: 401,
      });
      httpClientMock.post.mockReturnValue(throwError(() => errorResponse));

      service.login('test@example.com', 'wrong').subscribe({
        error: (err) => {
          expect(err.message).toBe('Invalid credentials');
        },
      });
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
    it('should register and login user', () => {
      httpClientMock.post.mockReturnValue(of(mockUser));
      // Register calls login internally
      const loginSpy = vi
        .spyOn(service, 'login')
        .mockReturnValue(of({ ...mockUser, token: 'token' }));

      service.register({ email: 'test@example.com', password: 'password123' }).subscribe((user) => {
        expect(loginSpy).toHaveBeenCalled();
        expect(user.token).toBe('token');
      });
    });
  });

  describe('checkUsernameUnique', () => {
    it('should return true if username is available', () => {
      httpClientMock.get.mockReturnValue(of({ isAvailable: true }));

      service.checkUsernameUnique('newuser').subscribe((isAvailable) => {
        expect(isAvailable).toBe(true);
      });
    });

    it('should return false if username is taken', () => {
      httpClientMock.get.mockReturnValue(of({ isAvailable: false }));

      service.checkUsernameUnique('takenuser').subscribe((isAvailable) => {
        expect(isAvailable).toBe(false);
      });
    });

    it('should return true for empty username without calling API', () => {
      service.checkUsernameUnique('').subscribe((isAvailable) => {
        expect(isAvailable).toBe(true);
        expect(httpClientMock.get).not.toHaveBeenCalled();
      });
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
  });
});
