import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, UserRole } from '../../../core/models/user.model';
import { SelectOption } from '../../../core/models/common.model';
import { ReservationStatus } from '../../../core/models/reservation.model';
import { UserService } from '../../../core/services/user.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { CarService } from '../../../core/services/car.service';
import { SecurityUtils } from '../../../core/utils/security.utils';
import { Store } from '@ngrx/store';
import * as BookingActions from '../../../core/store/booking/booking.actions';

// PrimeNG
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';

import { DESIGN_SYSTEM } from '../../../shared/theme/design-system';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ToastModule,
    TagModule,
    SelectModule,
    PasswordModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  readonly theme = DESIGN_SYSTEM;

  readonly styles = {
    opsCenter: ['ops-center', 'py-8', 'px-4', 'lg:px-8'],
    tableContainer: ['glass-panel', 'overflow-hidden', 'fadeinup', 'animation-duration-1000'],
    tableHeader: ['uppercase', 'tracking-widest', 'text-sm', 'font-bold'],
    validationWarning: ['validation-warning'],
  };

  private userService = inject(UserService);
  private reservationService = inject(ReservationService);
  private carService = inject(CarService);
  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private store = inject(Store);

  users: User[] = [];
  userDialog = false;
  bookingsDialog = false;
  userForm!: FormGroup;
  submitted = false;
  
  selectedUserBookings: any[] = [];
  selectedUser: User | null = null;

  roles: SelectOption[] = [
    { label: 'Admin', value: UserRole.ADMIN },
    { label: 'User', value: UserRole.USER },
  ];

  ngOnInit() {
    this.loadUsers();
    this.initForm();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((users) => (this.users = users));
  }

  initForm() {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s-]+$/)]],
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_\-]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        (control: any) => (/[A-Z]/.test(control.value) ? null : { uppercase: true }),
        (control: any) => (/[0-9]/.test(control.value) ? null : { number: true }),
        (control: any) => (/[!@#$%^&*(),.?":{}|<>]/.test(control.value) ? null : { special: true })
      ]],
      role: ['user', Validators.required],
    });
  }

  openNew() {
    this.userForm.reset({ role: 'user' });
    this.submitted = false;
    this.userDialog = true;
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.users = this.users.filter((val) => val.id !== user.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'User Deleted',
              life: 3000,
            });
          },
          error: (err) => this.handleError('Error', 'Could not delete user', err),
        });
      },
    });
  }

  viewBookings(user: User) {
    this.selectedUser = user;
    forkJoin({
      reservations: this.reservationService.getUserReservations(user.id),
      cars: this.carService.getCars()
    }).subscribe(({ reservations, cars }) => {
      this.selectedUserBookings = reservations.map(res => ({
        ...res,
        car: cars.find(c => c.id === res.carId)
      }));
      this.bookingsDialog = true;
    });
  }

  saveUser() {
    this.submitted = true;

    if (this.userForm.invalid) {
      return;
    }

    const userData = SecurityUtils.sanitizeObject(this.userForm.value);

    // In a real app we might have updateUser too, assuming addUser handles both or distinct
    this.userService.addUser(userData).subscribe({
      next: () => this.handleSuccess('User Created'),
      error: (err) => this.handleError('Error', 'Could not add user', err),
    });
  }

  private handleSuccess(detail: string) {
    this.loadUsers();
    this.hideDialog();
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: detail,
      life: 3000,
    });
  }

  private handleError(summary: string, detail: string, error?: any) {
    console.error(detail, error);
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail,
      life: 3000,
    });
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  getBookingSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case ReservationStatus.CONFIRMED: return 'success';
      case ReservationStatus.PENDING: return 'info';
      case ReservationStatus.CANCELLED: return 'danger';
      case ReservationStatus.COMPLETED: return 'secondary';
      default: return 'info';
    }
  }

  deleteReservation(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel this deployment?',
      header: 'Confirm Cancellation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.store.dispatch(BookingActions.deleteReservation({ id }));
        // Remove from local array immediately for UI update
        this.selectedUserBookings = this.selectedUserBookings.filter(b => b.id !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'Deployment Cancelled',
          detail: 'Reservation has been successfully removed.'
        });
      }
    });
  }
}
