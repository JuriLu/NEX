import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { Car } from '../../core/models/car.model';
import { ReservationStatus } from '../../core/models/reservation.model';
import { CarService } from '../../core/services/car.service';
import { selectUser } from '../../core/store/auth/auth.selectors';
import { createReservation, loadReservations } from '../../core/store/booking/booking.actions';
import { selectAllReservations } from '../../core/store/booking/booking.selectors';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';

import { DESIGN_SYSTEM } from '../../shared/theme/design-system';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    DatePickerModule,
    InputTextModule,
    RouterLink,
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent implements OnInit {
  readonly theme = DESIGN_SYSTEM;

  readonly styles = {
    previewStage: ['preview-stage', 'glass-panel', 'p-4', 'mb-6', 'relative', 'overflow-hidden'],
    featureCard: ['feature-card', 'glass-panel', 'p-3', 'flex', 'align-items-center', 'gap-3'],
    configPanel: ['config-panel', 'glass-panel', 'p-5', 'sticky', 'top-0'],
    summarySection: ['summary-section', 'p-4', 'border-round-xl'],
    validationWarning: ['validation-warning', 'mt-3'],
    backLink: [
      'text-secondary',
      'no-underline',
      'hover:text-white',
      'transition-all',
      'flex',
      'align-items-center',
      'gap-2',
    ],
  };

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private carService = inject(CarService);
  private store = inject(Store);

  car$!: Observable<Car>;
  bookingForm!: FormGroup;
  minDate = new Date();
  disabledDates: Date[] = [];
  totalPrice = 0;

  ngOnInit() {
    const carId = Number(this.route.snapshot.paramMap.get('carId'));
    this.car$ = this.carService.getCar(carId);

    this.bookingForm = this.fb.group({
      dates: [null, [Validators.required]],
    });

    this.store.dispatch(loadReservations());
    this.setupDisabledDates(carId);

    this.bookingForm.get('dates')?.valueChanges.subscribe((value) => {
      if (value && value[0] && value[1]) {
        this.calculateTotal(value[0], value[1], carId);
      }
    });
  }

  private calculateTotal(start: Date, end: Date, carId: number) {
    this.car$.pipe(take(1)).subscribe((car) => {
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      this.totalPrice = days * car.pricePerDay;
    });
  }

  private setupDisabledDates(carId: number) {
    this.store.select(selectAllReservations).subscribe((reservations) => {
      const carReservations = reservations.filter(
        (r) => r.carId === carId && (r.status === ReservationStatus.CONFIRMED || r.status === ReservationStatus.PENDING)
      );

      const dates: Date[] = [];
      carReservations.forEach((res) => {
        let current = new Date(res.startDate);
        const end = new Date(res.endDate);

        // Normalize to midnight for comparison
        current.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        while (current <= end) {
          dates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
      });
      this.disabledDates = dates;
    });
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      const [start, end] = this.bookingForm.value.dates;
      const carId = Number(this.route.snapshot.paramMap.get('carId'));

      this.store
        .select(selectUser)
        .pipe(take(1))
        .subscribe((user) => {
          if (!user) {
            this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
            return;
          }

          this.car$.pipe(take(1)).subscribe((car) => {
            const reservation = {
              userId: user.id,
              carId,
              startDate: start.toISOString(),
              endDate: end ? end.toISOString() : start.toISOString(),
              totalPrice: this.totalPrice,
              currency: car.currency || 'USD',
              status: ReservationStatus.CONFIRMED,
            };

            this.store.dispatch(createReservation({ reservation }));
            this.router.navigate(['/catalog']); // Redirect after booking
          });
        });
    }
  }
}
