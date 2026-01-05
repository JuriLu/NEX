import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { authInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  const AUTH_USER_KEY = 'auth_user';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    window.localStorage.removeItem(AUTH_USER_KEY);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add an Authorization header when a token is present in localStorage', () => {
    const mockToken = 'test-token';
    const mockUser = { token: mockToken };
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUser));

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
  });

  it('should not add an Authorization header when no token is present', () => {
    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
  });

  it('should not overwrite an existing Authorization header', () => {
    const mockToken = 'test-token';
    const mockUser = { token: mockToken };
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUser));

    httpClient.get('/test', { headers: { Authorization: 'Existing-Token' } }).subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.get('Authorization')).toBe('Existing-Token');
  });

  it('should handle malformed JSON in localStorage', () => {
    window.localStorage.setItem(AUTH_USER_KEY, 'not-json');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Should not throw, just proceed without token
    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBe(false);

    consoleSpy.mockRestore();
  });

  it('should handle JSON with missing token property', () => {
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ name: 'no-token' }));

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
  });
});
