import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { ReservationStatus } from '../../core/models/reservation.model';
import { UserRole } from '../../core/models/user.model';
import { CarService } from '../../core/services/car.service';
import { selectUser } from '../../core/store/auth/auth.selectors';
import * as BookingActions from '../../core/store/booking/booking.actions';
import { selectAllReservations } from '../../core/store/booking/booking.selectors';
import { BookingComponent } from './booking.component';

// PrimeNG Mocks
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';

describe('BookingComponent', () => {
  let component: BookingComponent;
  let fixture: ComponentFixture<BookingComponent>;
  let store: MockStore;
  let carService: any;
  let router: any;

  const mockCar = {
    id: 1,
    brand: 'Tesla',
    model: 'Model S',
    pricePerDay: 150,
    currency: 'USD',
    category: 'Luxury',
    image: 'tesla.jpg',
    features: ['Autopilot', 'Ludicrous Mode'],
  };

  const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: UserRole.USER,
  };

  beforeEach(async () => {
    carService = {
      getCar: vi.fn().mockReturnValue(of(mockCar)),
    };

    router = {
      navigate: vi.fn(),
      url: '/booking/1',
    };

    const activatedRoute = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue('1'),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [
        BookingComponent,
        ReactiveFormsModule,
        ButtonModule,
        CardModule,
        DatePickerModule,
        InputTextModule,
      ],
      providers: [
        { provide: CarService, useValue: carService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
        provideMockStore({
          selectors: [
            { selector: selectAllReservations, value: [] },
            { selector: selectUser, value: mockUser },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    // Stub the template to avoid resource issues if needed (handled by our vitest plugin)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load car details and reservations on init', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(carService.getCar).toHaveBeenCalledWith(1);
    expect(dispatchSpy).toHaveBeenCalledWith(BookingActions.loadReservations());
  });

  it('should calculate total price when dates change', () => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 2); // 3 days total (start, tomorrow, end)

    component.bookingForm.get('dates')?.setValue([startDate, endDate]);

    // 3 days * 150 = 450
    expect(component.totalPrice).toBe(450);
  });

  it('should populate disabledDates based on existing reservations', () => {
    const existingReservations = [
      {
        id: 10,
        carId: 1,
        startDate: '2025-01-01T00:00:00.000Z',
        endDate: '2025-01-02T00:00:00.000Z',
        status: ReservationStatus.CONFIRMED,
        userId: 2,
        totalPrice: 300,
        currency: 'USD',
      },
    ];

    store.overrideSelector(selectAllReservations, existingReservations);
    store.refreshState();

    // Re-run setup logic
    (component as any).setupDisabledDates(1);

    expect(component.disabledDates.length).toBe(2);
    expect(component.disabledDates[0].getDate()).toBe(1);
    expect(component.disabledDates[1].getDate()).toBe(2);
  });

  it('should redirect to login if user is not authenticated on submit', () => {
    store.overrideSelector(selectUser, null);
    store.refreshState();

    component.bookingForm.get('dates')?.setValue([new Date(), new Date()]);
    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
      queryParams: { returnUrl: '/booking/1' },
    });
  });

  it('should dispatch createReservation and navigate to catalog on successful submit', () => {
    const startDate = new Date('2025-06-01');
    const endDate = new Date('2025-06-03');
    component.bookingForm.get('dates')?.setValue([startDate, endDate]);
    (component as any).calculateTotal(startDate, endDate, 1); // Ensure total is set

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: BookingActions.createReservation.type,
        reservation: expect.objectContaining({
          carId: 1,
          userId: mockUser.id,
          totalPrice: 450,
        }),
      })
    );
    expect(router.navigate).toHaveBeenCalledWith(['/catalog']);
  });
  it('should not calculate total if dates are incomplete', () => {
    const startDate = new Date();
    component.bookingForm.get('dates')?.setValue([startDate, null]);
    expect(component.totalPrice).toBe(0);
  });

  it('should include PENDING reservations in disabled dates', () => {
    const pendingReservations = [
      {
        id: 11,
        carId: 1,
        startDate: '2025-02-01T00:00:00.000Z',
        endDate: '2025-02-01T00:00:00.000Z',
        status: ReservationStatus.PENDING,
        userId: 3,
        totalPrice: 150,
        currency: 'USD',
      },
    ];

    store.overrideSelector(selectAllReservations, pendingReservations);
    store.refreshState();

    (component as any).setupDisabledDates(1);

    expect(component.disabledDates.length).toBe(1);
    expect(component.disabledDates[0].getDate()).toBe(1);
    expect(component.disabledDates[0].getMonth()).toBe(1); // February (0-indexed)
  });

  it('should exclude CANCELLED reservations from disabled dates', () => {
    const cancelledReservations = [
      {
        id: 12,
        carId: 1,
        startDate: '2025-03-01T00:00:00.000Z',
        endDate: '2025-03-02T00:00:00.000Z',
        status: ReservationStatus.CANCELLED,
        userId: 4,
        totalPrice: 300,
        currency: 'USD',
      },
    ];

    store.overrideSelector(selectAllReservations, cancelledReservations);
    store.refreshState();

    (component as any).setupDisabledDates(1);

    expect(component.disabledDates.length).toBe(0);
  });

  it('should default endDate to startDate if endDate is missing on submit', () => {
    const startDate = new Date('2025-07-01');
    component.bookingForm.get('dates')?.setValue([startDate, null]);
    // Manually set invalid status to valid to simulate "valid enough" state if needed,
    // or just assume form validators might pass.
    // However, if the form is invalid, onSubmit does nothing.
    // If the validator "required" is satisfied by [date, null], then it proceeds.
    // Let's force proper form behavior just in case:
    // Just blindly calling onSubmit assumes valid. We should ensure valid mock or property.
    // Since we are unit testing logic inside `if (bookingForm.valid)`, we can spy on valid property?
    // Or just rely on the fact that [Date, null] IS truthy enough for 'required' in some cases or mock the validity.
    // Let's mock the valid property get.
    const validSpy = vi.spyOn(component.bookingForm, 'valid', 'get').mockReturnValue(true);

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: BookingActions.createReservation.type,
        reservation: expect.objectContaining({
          startDate: startDate.toISOString(),
          endDate: startDate.toISOString(), // Expect start date duplicated
        }),
      })
    );
  });
});
