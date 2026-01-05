import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Reservation, ReservationStatus } from '../../models/reservation.model';
import { ReservationService } from '../../services/reservation.service';
import * as BookingActions from './booking.actions';
import { BookingEffects } from './booking.effects';
import { bookingReducer, BookingState, initialState } from './booking.reducer';
import * as BookingSelectors from './booking.selectors';

describe('Booking Store', () => {
  const mockReservation: Reservation = {
    id: 1,
    userId: 1,
    carId: 1,
    startDate: '2025-01-01',
    endDate: '2025-01-05',
    totalPrice: 500,
    currency: 'USD',
    status: ReservationStatus.CONFIRMED,
  };

  describe('Booking Reducer', () => {
    it('should return the initial state', () => {
      const action = { type: 'Unknown' } as any;
      const state = bookingReducer(initialState, action);
      expect(state).toBe(initialState);
    });

    it('should set loading to true on loadReservations action', () => {
      const action = BookingActions.loadReservations();
      const state = bookingReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set reservations and loading to false on loadReservationsSuccess action', () => {
      const reservations = [mockReservation];
      const action = BookingActions.loadReservationsSuccess({ reservations });
      const state = bookingReducer(initialState, action);
      expect(state.reservations).toEqual(reservations);
      expect(state.loading).toBe(false);
    });

    it('should set error and loading to false on loadReservationsFailure action', () => {
      const error = 'Failed to load';
      const action = BookingActions.loadReservationsFailure({ error });
      const state = bookingReducer(initialState, action);
      expect(state.error).toBe(error);
      expect(state.loading).toBe(false);
    });

    it('should add reservation on createReservationSuccess action', () => {
      const action = BookingActions.createReservationSuccess({ reservation: mockReservation });
      const state = bookingReducer(initialState, action);
      expect(state.reservations).toContain(mockReservation);
      expect(state.loading).toBe(false);
    });

    it('should remove reservation on deleteReservationSuccess action', () => {
      const stateWithReservations: BookingState = {
        ...initialState,
        reservations: [mockReservation],
      };
      const action = BookingActions.deleteReservationSuccess({ id: mockReservation.id });
      const state = bookingReducer(stateWithReservations, action);
      expect(state.reservations).not.toContain(mockReservation);
      expect(state.loading).toBe(false);
    });
  });

  describe('Booking Selectors', () => {
    const state: BookingState = {
      reservations: [mockReservation],
      loading: false,
      error: 'some error',
    };
    const rootState = { booking: state };

    it('should select the booking state', () => {
      const result = BookingSelectors.selectBookingState(rootState);
      expect(result).toEqual(state);
    });

    it('should select all reservations', () => {
      const result = BookingSelectors.selectAllReservations(rootState);
      expect(result).toEqual([mockReservation]);
    });

    it('should select loading', () => {
      const result = BookingSelectors.selectBookingLoading(rootState);
      expect(result).toBe(false);
    });

    it('should select error', () => {
      const result = BookingSelectors.selectBookingError(rootState);
      expect(result).toBe('some error');
    });
  });

  describe('Booking Effects', () => {
    let actions$: Observable<Action>;
    let effects: BookingEffects;
    let reservationService: any;

    beforeEach(() => {
      reservationService = {
        getReservations: vi.fn(),
        createReservation: vi.fn(),
        deleteReservation: vi.fn(),
      };

      TestBed.configureTestingModule({
        providers: [
          BookingEffects,
          provideMockActions(() => actions$),
          { provide: ReservationService, useValue: reservationService },
        ],
      });

      effects = TestBed.inject(BookingEffects);
    });

    it('should dispatch loadReservationsSuccess on successful load', () => {
      const action = BookingActions.loadReservations();
      const reservations = [mockReservation];
      const successAction = BookingActions.loadReservationsSuccess({ reservations });

      actions$ = of(action);
      reservationService.getReservations.mockReturnValue(of(reservations));

      effects.loadReservations$.subscribe((result) => {
        expect(result).toEqual(successAction);
      });
    });

    it('should dispatch createReservationSuccess on successful create', () => {
      const { id, ...newRes } = mockReservation;
      const action = BookingActions.createReservation({ reservation: newRes });
      const successAction = BookingActions.createReservationSuccess({
        reservation: mockReservation,
      });

      actions$ = of(action);
      reservationService.createReservation.mockReturnValue(of(mockReservation));

      effects.createReservation$.subscribe((result) => {
        expect(result).toEqual(successAction);
      });
    });

    it('should dispatch deleteReservationSuccess on successful delete', () => {
      const action = BookingActions.deleteReservation({ id: 1 });
      const successAction = BookingActions.deleteReservationSuccess({ id: 1 });

      actions$ = of(action);
      reservationService.deleteReservation.mockReturnValue(of(null));

      effects.deleteReservation$.subscribe((result) => {
        expect(result).toEqual(successAction);
      });
    });
  });
});
