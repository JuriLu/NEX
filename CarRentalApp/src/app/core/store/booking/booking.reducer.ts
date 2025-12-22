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
  error: null
};

export const bookingReducer = createReducer(
  initialState,
  on(BookingActions.loadReservations, (state) => ({ ...state, loading: true, error: null })),
  on(BookingActions.loadReservationsSuccess, (state, { reservations }) => ({
    ...state,
    reservations,
    loading: false
  })),
  on(BookingActions.loadReservationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(BookingActions.createReservation, (state) => ({ ...state, loading: true, error: null })),
  on(BookingActions.createReservationSuccess, (state, { reservation }) => ({
    ...state,
    reservations: [...state.reservations, reservation],
    loading: false
  })),
  on(BookingActions.createReservationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
