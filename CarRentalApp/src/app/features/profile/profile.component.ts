import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, take } from 'rxjs';
import { User } from '../../core/models/user.model';
import { CarService } from '../../core/services/car.service';
import { ReservationService } from '../../core/services/reservation.service';
import { UserService } from '../../core/services/user.service';
import * as AuthActions from '../../core/store/auth/auth.actions';
import { selectUser } from '../../core/store/auth/auth.selectors';
import { SecurityUtils } from '../../core/utils/security.utils';

// PrimeNG
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { NexDialogComponent } from '../../shared/components/nex-dialog/nex-dialog.component';
import { NexFormFieldComponent } from '../../shared/components/nex-form-field/nex-form-field.component';
import { DESIGN_SYSTEM } from '../../shared/theme/design-system';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    AvatarModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    TagModule,
    TableModule,
    TooltipModule,
    NexDialogComponent,
    NexFormFieldComponent
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
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
  userBookings$!: Observable<any[]>;

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
    { name: 'Neon Green', color: '#39FF14' }
  ];

  ngOnInit() {
    this.initForms();
    this.loadBookingHistory();
    this.loadAmbientColor();
  }

  initForms() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9]*$/)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        (control: any) => (/[A-Z]/.test(control.value) ? null : { uppercase: true }),
        (control: any) => (/[0-9]/.test(control.value) ? null : { number: true }),
        (control: any) => (/[!@#$%^&*(),.?":{}|<>]/.test(control.value) ? null : { special: true })
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  loadBookingHistory() {
    this.user$.subscribe(user => {
      if (user) {
        const reservations$ = this.reservationService.getUserReservations(user.id);
        const cars$ = this.carService.getCars();

        this.userBookings$ = combineLatest([reservations$, cars$]).pipe(
          map(([reservations, cars]) => {
            return reservations.map(res => ({
              ...res,
              car: cars.find(c => c.id === res.carId)
            })).sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
          })
        );
      }
    });
  }

  openEdit() {
    this.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.profileForm.patchValue(user);
        this.editDialog = true;
      }
    });
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.user$.pipe(take(1)).subscribe(user => {
        if (user) {
          // fetch full user data to ensure the password is NOT lost during the update (since it's missing from the store)
          this.userService.getUsers().pipe(take(1)).subscribe((users: User[]) => {
             const fullUser = users.find((u: User) => u.id === user.id);
             if (fullUser) {
               const updatedUser = { ...fullUser, ...this.profileForm.value };
               const sanitizedData = SecurityUtils.sanitizeObject(updatedUser);
               this.store.dispatch(AuthActions.updateUser({ user: sanitizedData as User }));
               this.messageService.add({
                 severity: 'success',
                 summary: 'Profile Updated',
                 detail: 'Personal identity synchronized successfully.'
               });
               this.editDialog = false;
             }
          });
        }
      });
    }
  }

  updatePassword() {
    if (this.passwordForm.valid) {
      const currentInput = this.passwordForm.get('currentPassword')?.value;
      const newKey = this.passwordForm.get('newPassword')?.value;

      this.user$.pipe(take(1)).subscribe(user => {
        if (user) {
          this.userService.updatePassword(user.id, {
            currentPassword: currentInput,
            newPassword: newKey,
          }).pipe(take(1)).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Security Enhanced',
                detail: 'Master key successfully rotated.'
              });
              this.passwordDialog = false;
              this.passwordForm.reset();
            },
            error: () => {
              this.passwordForm.get('currentPassword')?.setErrors({ incorrect: true });
              this.messageService.add({
                severity: 'error',
                summary: 'Authentication Failed',
                detail: 'The current master key provided is invalid.'
              });
            }
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
      detail: `Cabin lighting set to ${this.ambientColors.find(c => c.color === color)?.name}.`
    });
  }

  getBookingSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'Confirmed': return 'success';
      case 'Pending': return 'info';
      case 'Cancelled': return 'danger';
      case 'Completed': return 'secondary';
      default: return 'info';
    }
  }
}
