import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import 'zone.js/testing';
import { User, UserRole } from '../../../core/models/user.model';
import { CarService } from '../../../core/services/car.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { UserService } from '../../../core/services/user.service';
import { UserManagementComponent } from './user-management.component';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let userServiceMock: any;
  let reservationServiceMock: any;
  let carServiceMock: any;
  let storeMock: any;
  let confirmationServiceMock: any;
  let messageServiceMock: any;

  const mockUsers: User[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      role: UserRole.USER,
    },
  ];

  beforeEach(async () => {
    userServiceMock = {
      getUsers: vi.fn().mockReturnValue(of(mockUsers)),
      deleteUser: vi.fn().mockReturnValue(of({})),
      addUser: vi.fn().mockReturnValue(of(mockUsers[0])),
      checkUsernameAvailability: vi.fn().mockReturnValue(of({ isAvailable: true })),
    };

    reservationServiceMock = {
      getUserReservations: vi.fn().mockReturnValue(of([])),
    };

    carServiceMock = {
      getCars: vi.fn().mockReturnValue(of([])),
    };

    storeMock = {
      dispatch: vi.fn(),
    };

    confirmationServiceMock = {
      confirm: vi.fn().mockImplementation((config) => config.accept()),
    };

    messageServiceMock = {
      add: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UserManagementComponent, ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: ReservationService, useValue: reservationServiceMock },
        { provide: CarService, useValue: carServiceMock },
        { provide: Store, useValue: storeMock },
        { provide: ConfirmationService, useValue: confirmationServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(UserManagementComponent, {
        set: {
          template: '<div></div>',
          providers: [
            { provide: ConfirmationService, useValue: confirmationServiceMock },
            { provide: MessageService, useValue: messageServiceMock },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(userServiceMock.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });

  it('should delete user on confirmation', () => {
    component.deleteUser(mockUsers[0]);
    expect(confirmationServiceMock.confirm).toHaveBeenCalled();
    expect(userServiceMock.deleteUser).toHaveBeenCalledWith(mockUsers[0].id);
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ detail: 'User Deleted' })
    );
  });

  it('should open bookings dialog', () => {
    component.viewBookings(mockUsers[0]);
    expect(reservationServiceMock.getUserReservations).toHaveBeenCalledWith(mockUsers[0].id);
    expect(carServiceMock.getCars).toHaveBeenCalled();
    expect(component.bookingsDialog).toBe(true);
    expect(component.selectedUser).toEqual(mockUsers[0]);
  });

  it('should handle username availability async validation', async () => {
    const usernameControl = component.userForm.get('username');
    usernameControl?.setValue('newuser');

    // The validator has a timer(500), so we wait
    await new Promise((resolve) => setTimeout(resolve, 600));
    fixture.detectChanges();

    expect(userServiceMock.checkUsernameAvailability).toHaveBeenCalledWith('newuser');
    expect(usernameControl?.valid).toBe(true);
  });

  it('should save user when form is valid', () => {
    component.openNew();
    component.userForm.patchValue({
      firstName: 'Alice',
      lastName: 'Smith',
      username: 'alicesmith',
      email: 'alice@example.com',
      password: 'Password123!',
      role: 'user',
    });

    // Manually mark as valid to skip async validator wait in this sync test part
    component.userForm.get('username')?.setErrors(null);

    component.saveUser();

    expect(userServiceMock.addUser).toHaveBeenCalled();
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ detail: 'User Created' })
    );
  });
});
