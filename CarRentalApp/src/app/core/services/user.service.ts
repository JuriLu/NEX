import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  addUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(user: Partial<User>): Observable<User> {
    if (!user.id) {
      throw new Error('User id is required for update operations.');
    }
    return this.http.patch<User>(`${this.apiUrl}/${user.id}`, user);
  }

  updatePassword(
    id: number,
    payload: { currentPassword: string; newPassword: string },
  ): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/password`, payload);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
