import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ReservationService } from '../../services/reservation.service';
import * as BookingActions from './booking.actions';

@Injectable()
export class BookingEffects {
  private actions$ = inject(Actions);
  private reservationService = inject(ReservationService);

  loadReservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.loadReservations),
      mergeMap(() =>
        this.reservationService.getReservations().pipe(
          map((reservations) => BookingActions.loadReservationsSuccess({ reservations })),
          catchError((error) => of(BookingActions.loadReservationsFailure({ error: error.message })))
        )
      )
    )
  );

  createReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.createReservation),
      mergeMap(({ reservation }) =>
        this.reservationService.createReservation(reservation).pipe(
          map((newReservation) => BookingActions.createReservationSuccess({ reservation: newReservation })),
          catchError((error) => of(BookingActions.createReservationFailure({ error: error.message })))
        )
      )
    )
  );
}
