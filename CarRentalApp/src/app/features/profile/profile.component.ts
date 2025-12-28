import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { User } from '../../core/models/user.model';
import { selectUser } from '../../core/store/auth/auth.selectors';
import { CarService } from '../../core/services/car.service';
import { ReservationService } from '../../core/services/reservation.service';
import { SecurityUtils } from '../../core/utils/security.utils';

// PrimeNG
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

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
    TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  readonly theme = DESIGN_SYSTEM;
  private store = inject(Store);
  private fb = inject(FormBuilder);
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
  }

  initForms() {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
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
    this.user$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue(user);
        this.editDialog = true;
      }
    });
  }

  saveProfile() {
    if (this.profileForm.valid) {
      const sanitizedData = SecurityUtils.sanitizeObject(this.profileForm.value);
      // Mock save
      this.messageService.add({severity:'success', summary:'Profile Updated', detail:'Personal identity synchronized successfully.'});
      this.editDialog = false;
    }
  }

  updatePassword() {
    if (this.passwordForm.valid) {
      const sanitizedData = SecurityUtils.sanitizeObject(this.passwordForm.value);
      // Mock save
      this.messageService.add({severity:'success', summary:'Security Enhanced', detail:'Master key successfully rotated.'});
      this.passwordDialog = false;
      this.passwordForm.reset();
    }
  }

  setAmbientColor(color: string) {
    this.selectedColor = color;
    this.messageService.add({severity:'info', summary:'Ambience Adjusted', detail:`Cabin lighting set to ${this.ambientColors.find(c => c.color === color)?.name}.`});
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
