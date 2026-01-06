import { createReducer, on } from '@ngrx/store';
import { Reservation } from '../../models/reservation.model';
import * as BookingActions from './booking.actions';

export interface BookingState {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
}

export const initialState: BookingState = {
  reservations: [],
  loading: false,
  error: null,
};

export const bookingReducer = createReducer(
  initialState,
  on(BookingActions.loadReservations, (state: BookingState) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(BookingActions.loadReservationsSuccess, (state: BookingState, { reservations }) => ({
    ...state,
    reservations,
    loading: false,
  })),
  on(
    BookingActions.loadReservationsFailure,
    (state: BookingState, { error }: { error: string }) => ({
      ...state,
      loading: false,
      error,
    })
  ),
  on(BookingActions.createReservation, (state: BookingState) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(BookingActions.createReservationSuccess, (state: BookingState, { reservation }: { reservation: Reservation }) => ({
    ...state,
    reservations: [...state.reservations, reservation],
    loading: false,
  })),
  on(
    BookingActions.createReservationFailure,
    (state: BookingState, { error }: { error: string }) => ({
      ...state,
      loading: false,
      error,
    })
  ),
  on(BookingActions.deleteReservation, (state: BookingState) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(BookingActions.deleteReservationSuccess, (state: BookingState, { id }: { id: number }) => ({
    ...state,
    reservations: state.reservations.filter((r) => r.id !== id),
    loading: false,
  })),
  on(
    BookingActions.deleteReservationFailure,
    (state: BookingState, { error }: { error: string }) => ({
      ...state,
      loading: false,
      error,
    })
  )
);
