import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation, ReservationStatus } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient);
  private reservationsUrl = 'api/reservations';

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.reservationsUrl);
  }

  getUserReservations(userId: number): Observable<Reservation[]> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<Reservation[]>(this.reservationsUrl, { params });
  }

  createReservation(reservation: Omit<Reservation, 'id'>): Observable<Reservation> {
    return this.http.post<Reservation>(this.reservationsUrl, reservation);
  }

  updateReservationStatus(id: number, status: ReservationStatus): Observable<any> {
    return this.http.patch(`${this.reservationsUrl}/${id}`, { status });
  }

  deleteReservation(id: number): Observable<any> {
    return this.http.delete(`${this.reservationsUrl}/${id}`);
  }
}
