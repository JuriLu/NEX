import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducer';
import { bookingReducer, BookingState } from './booking/booking.reducer';

export interface AppState {
  auth: AuthState;
  booking: BookingState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  booking: bookingReducer
};
