import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ReservationService } from '../../services/reservation.service';
import * as BookingActions from './booking.actions';
import { Reservation } from '../../models/reservation.model';

@Injectable()
export class BookingEffects {
  private actions$ = inject(Actions);
  private reservationService = inject(ReservationService);

  loadReservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.loadReservations),
      mergeMap(() =>
        this.reservationService.getReservations().pipe(
          map((reservations: Reservation[]) => BookingActions.loadReservationsSuccess({ reservations })),
          catchError((error) => of(BookingActions.loadReservationsFailure({ error: error.message })))
        )
      )
    )
  );

  createReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.createReservation),
      mergeMap(({ reservation }: { reservation: Omit<Reservation, "id"> }) =>
        this.reservationService.createReservation(reservation).pipe(
          map((newReservation: Reservation) => BookingActions.createReservationSuccess({ reservation: newReservation })),
          catchError((error) => of(BookingActions.createReservationFailure({ error: error.message })))
        )
      )
    )
  );

  deleteReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.deleteReservation),
      mergeMap(({ id }: { id: number }) =>
        this.reservationService.deleteReservation(id).pipe(
          map(() => BookingActions.deleteReservationSuccess({ id })),
          catchError((error) => of(BookingActions.deleteReservationFailure({ error: error.message })))
        )
      )
    )
  );
}
