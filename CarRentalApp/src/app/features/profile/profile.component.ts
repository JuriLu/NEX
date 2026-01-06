import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, of, switchMap, take, timer } from 'rxjs';
import { User } from '../../core/models/user.model';
import { CarService } from '../../core/services/car.service';
import { ReservationService } from '../../core/services/reservation.service';
import { UserService } from '../../core/services/user.service';
import * as AuthActions from '../../core/store/auth/auth.actions';
import { selectUser } from '../../core/store/auth/auth.selectors';
import { SecurityUtils } from '../../core/utils/security.utils';

// PrimeNG
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { DESIGN_SYSTEM } from '../../shared/theme/design-system';
import { ProfileBookingsComponent } from './components/profile-bookings/profile-bookings.component';
import { ProfileEditDialogComponent } from './components/profile-edit-dialog/profile-edit-dialog.component';
import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { ProfilePasswordDialogComponent } from './components/profile-password-dialog/profile-password-dialog.component';
import { ProfilePreferencesComponent } from './components/profile-preferences/profile-preferences.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ProfileInfoComponent,
    ProfilePreferencesComponent,
    ProfileBookingsComponent,
    ProfileEditDialogComponent,
    ProfilePasswordDialogComponent,
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  readonly theme = DESIGN_SYSTEM;
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private carService = inject(CarService);
  private reservationService = inject(ReservationService);
  private messageService = inject(MessageService);

  user$: Observable<User | null> = this.store.select(selectUser);
  userBookings$: Observable<any[]> = this.user$.pipe(
    switchMap((user) => {
      if (!user) return of([]);
      const reservations$ = this.reservationService.getUserReservations(user.id);
      const cars$ = this.carService.getCars();

      return combineLatest([reservations$, cars$]).pipe(
        map(([reservations, cars]) => {
          return reservations
            .map((res) => ({
              ...res,
              car: cars.find((c) => c.id === res.carId),
            }))
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        })
      );
    })
  );

  editDialog = false;
  passwordDialog = false;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  selectedColor = '#7B4DFF';
  ambientColors = [
    { name: 'NEX Violet', color: '#7B4DFF' },
    { name: 'Digital Cyan', color: '#00F0FF' },
    { name: 'Hyper Orange', color: '#FF7D00' },
    { name: 'Stealth Grey', color: '#3A4452' },
    { name: 'Neon Green', color: '#39FF14' },
  ];

  ngOnInit() {
    this.initForms();
    this.loadAmbientColor();
  }

  initForms() {
    this.profileForm = this.fb.group({
      firstName: [
        '',
        [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]*$/)],
      ],
      lastName: [
        '',
        [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]*$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      username: [
        '',
        [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9]*$/)],
        [this.usernameAvailabilityValidator()],
      ],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            (control: any) => (/[A-Z]/.test(control.value) ? null : { uppercase: true }),
            (control: any) => (/[0-9]/.test(control.value) ? null : { number: true }),
            (control: any) =>
              /[!@#$%^&*(),.?":{}|<>]/.test(control.value) ? null : { special: true },
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  usernameAvailabilityValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return timer(500).pipe(
        switchMap(() => this.user$.pipe(take(1))),
        switchMap((currentUser) => {
          if (currentUser && currentUser.username === control.value) {
            return of(null);
          }
          return this.userService
            .checkUsernameAvailability(control.value)
            .pipe(map((response) => (response.isAvailable ? null : { usernameTaken: true })));
        })
      );
    };
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  openEdit() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.profileForm.patchValue(user);
        this.editDialog = true;
      }
    });
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.user$.pipe(take(1)).subscribe((user) => {
        if (user) {
          // We use the ID from the store user and merge with form values.
          // Since the service uses PATCH, we don't need the full object (password etc.)
          const updatedUser: User = {
            ...user,
            ...this.profileForm.value,
          };

          const sanitizedData = SecurityUtils.sanitizeObject(updatedUser);
          this.store.dispatch(AuthActions.updateUser({ user: sanitizedData }));

          this.messageService.add({
            severity: 'success',
            summary: 'Profile Updated',
            detail: 'Personal identity synchronized successfully.',
          });
          this.editDialog = false;
        }
      });
    }
  }

  updatePassword() {
    if (this.passwordForm.valid) {
      const currentInput = this.passwordForm.get('currentPassword')?.value;
      const newKey = this.passwordForm.get('newPassword')?.value;

      this.user$.pipe(take(1)).subscribe((user) => {
        if (user) {
          this.userService
            .updatePassword(user.id, {
              currentPassword: currentInput,
              newPassword: newKey,
            })
            .pipe(take(1))
            .subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Security Enhanced',
                  detail: 'Master key successfully rotated.',
                });
                this.passwordDialog = false;
                this.passwordForm.reset();
              },
              error: () => {
                this.passwordForm.get('currentPassword')?.setErrors({ incorrect: true });
                this.messageService.add({
                  severity: 'error',
                  summary: 'Authentication Failed',
                  detail: 'The current master key provided is invalid.',
                });
              },
            });
        }
      });
    }
  }

  loadAmbientColor() {
    const savedColor = localStorage.getItem('nex_ambient_color');
    if (savedColor) {
      this.selectedColor = savedColor;
    }
  }

  setAmbientColor(color: string) {
    this.selectedColor = color;
    localStorage.setItem('nex_ambient_color', color);
    this.messageService.add({
      severity: 'info',
      summary: 'Ambience Adjusted',
      detail: `Cabin lighting set to ${this.ambientColors.find((c) => c.color === color)?.name}.`,
    });
  }
}
