import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserRole } from '../models/user.model';

interface AuthResponse {
  access_token: string;
  user: User;
}

interface UsernameAvailabilityResponse {
  isAvailable: boolean;
}

type RegistrationRequest = Partial<User> & { password?: string; confirmPassword?: string };
interface RegistrationPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly authUrl = `${environment.apiUrl}/auth`;
  private readonly storageKey = 'auth_user';

  register(user: RegistrationRequest): Observable<User> {
    let payload: RegistrationPayload;
    try {
      payload = this.buildRegistrationPayload(user);
    } catch (error) {
      return throwError(() =>
        error instanceof Error ? error : new Error('Invalid registration data.')
      );
    }

    return this.http.post<User>(`${this.authUrl}/register`, payload).pipe(
      switchMap(() => this.login(payload.email, payload.password)),
      catchError((error) =>
        throwError(
          () => new Error(this.extractErrorMessage(error, 'Unable to register. Please try again.'))
        )
      )
    );
  }

  checkUsernameUnique(username: string): Observable<boolean> {
    const trimmedUsername = username?.trim();
    if (!trimmedUsername) {
      return of(true);
    }

    return this.http
      .get<UsernameAvailabilityResponse>(
        `${this.authUrl}/check-username/${encodeURIComponent(trimmedUsername)}`
      )
      .pipe(
        map((response:UsernameAvailabilityResponse) => response.isAvailable),
        catchError(() => of(true))
      );
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, { email, password }).pipe(
      map(({ access_token, user }: AuthResponse) => this.normalizeAuthenticatedUser(user, access_token)),
      tap((user: User) => this.persistUser(user)),
      catchError((error: HttpErrorResponse) =>
        throwError(() => new Error(this.extractErrorMessage(error, 'Invalid email or password.')))
      )
    );
  }

  logout(): void {
    this.clearStoredUser();
  }

  getCurrentUser(): User | null {
    return this.readStoredUser();
  }

  private buildRegistrationPayload(user: RegistrationRequest): RegistrationPayload {
    const password = user.password?.trim();
    if (!password) {
      throw new Error('Password is required.');
    }

    return {
      firstName: user.firstName?.trim() ?? '',
      lastName: user.lastName?.trim() ?? '',
      username: user.username?.trim() ?? '',
      email: user.email?.trim() ?? '',
      password,
      role: (user.role as UserRole) ?? UserRole.USER,
    };
  }

  private normalizeAuthenticatedUser(user: User, token: string): User {
    const normalizedUser: User = { ...user, token };
    delete normalizedUser.password;
    return normalizedUser;
  }

  private persistUser(user: User): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  private clearStoredUser(): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem(this.storageKey);
  }

  private readStoredUser(): User | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as User;
    } catch (error) {
      console.error('Failed to parse stored user', error);
      this.clearStoredUser();
      return null;
    }
  }

  private extractErrorMessage(error: HttpErrorResponse, fallback: string): string {
    if (!error) {
      return fallback;
    }

    if (error.status === 0) {
      return 'Unable to reach the server. Please try again later.';
    }

    const message = error.error?.message;
    if (Array.isArray(message)) {
      return message.join(', ');
    }

    return message || fallback;
  }
}
