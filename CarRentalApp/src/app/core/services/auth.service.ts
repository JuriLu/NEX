import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'api/users';

  register(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      map(newUser => {
        // Mock successful registration
        const userWithToken = { ...newUser, token: 'mock-jwt-token' } as User;
        return userWithToken;
      }),
      tap(createdUser => {
        localStorage.setItem('user', JSON.stringify(createdUser));
      })
    );
  }

  checkUsernameUnique(username: string): Observable<boolean> {
    // Mock check: simulate uniqueness (always true for now unless specific mock value)
    return new Observable(observer => {
      setTimeout(() => {
        const isTaken = username.toLowerCase() === 'admin'; // Mock 'admin' as taken
        observer.next(!isTaken);
        observer.complete();
      }, 500);
    });
  }

  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          const userWithToken = { ...user, token: 'mock-jwt-token' };
          delete userWithToken.password;
          return userWithToken;
        }
        throw new Error('Invalid email or password');
      }),
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
}
