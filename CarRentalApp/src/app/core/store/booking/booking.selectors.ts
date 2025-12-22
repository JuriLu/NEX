import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BookingState } from './booking.reducer';

export const selectBookingState = createFeatureSelector<BookingState>('booking');

export const selectAllReservations = createSelector(
  selectBookingState,
  (state: BookingState) => state.reservations
);

export const selectBookingLoading = createSelector(
  selectBookingState,
  (state: BookingState) => state.loading
);

export const selectBookingError = createSelector(
  selectBookingState,
  (state: BookingState) => state.error
);
