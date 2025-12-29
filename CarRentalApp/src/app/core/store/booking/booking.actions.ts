import { createAction, props } from '@ngrx/store';
import { Reservation } from '../../models/reservation.model';

export const loadReservations = createAction('[Booking] Load Reservations');
export const loadReservationsSuccess = createAction(
  '[Booking] Load Reservations Success',
  props<{ reservations: Reservation[] }>()
);
export const loadReservationsFailure = createAction(
  '[Booking] Load Reservations Failure',
  props<{ error: string }>()
);

export const createReservation = createAction(
  '[Booking] Create Reservation',
  props<{ reservation: Omit<Reservation, 'id'> }>()
);
export const createReservationSuccess = createAction(
  '[Booking] Create Reservation Success',
  props<{ reservation: Reservation }>()
);
export const createReservationFailure = createAction(
  '[Booking] Create Reservation Failure',
  props<{ error: string }>()
);

export const deleteReservation = createAction(
  '[Booking] Delete Reservation',
  props<{ id: number }>()
);
export const deleteReservationSuccess = createAction(
  '[Booking] Delete Reservation Success',
  props<{ id: number }>()
);
export const deleteReservationFailure = createAction(
  '[Booking] Delete Reservation Failure',
  props<{ error: string }>()
);
