import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reservation, ReservationStatus } from '../models/reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private http = inject(HttpClient);
  private readonly bookingsUrl = `${environment.apiUrl}/bookings`;

  getReservations(): Observable<Reservation[]> {
    return this.http
      .get<Reservation[]>(this.bookingsUrl)
      .pipe(
        map((reservations: Reservation[]) =>
          reservations.map((reservation: Reservation) => this.normalizeReservation(reservation))
        )
      );
  }

  getUserReservations(userId: number): Observable<Reservation[]> {
    return this.getReservations().pipe(
      map((reservations: Reservation[]) => reservations.filter((reservation: Reservation) => reservation.userId === userId))
    );
  }

  createReservation(reservation: Omit<Reservation, 'id'>): Observable<Reservation> {
    return this.http
      .post<Reservation>(this.bookingsUrl, reservation)
      .pipe(map((created: Reservation) => this.normalizeReservation(created)));
  }

  updateReservationStatus(id: number, status: ReservationStatus): Observable<Reservation> {
    return this.http
      .patch<Reservation>(`${this.bookingsUrl}/${id}`, { status })
      .pipe(map((updated: Reservation) => this.normalizeReservation(updated)));
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.bookingsUrl}/${id}`);
  }

  private normalizeReservation(reservation: Reservation): Reservation {
    return {
      ...reservation,
      status: (reservation.status ?? ReservationStatus.PENDING) as ReservationStatus,
    };
  }
}
