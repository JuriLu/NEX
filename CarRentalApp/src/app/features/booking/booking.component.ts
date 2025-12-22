import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { Car } from '../../core/models/car.model';
import { CarService } from '../../core/services/car.service';
import { selectUser } from '../../core/store/auth/auth.selectors';
import { createReservation } from '../../core/store/booking/booking.actions';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, CardModule,
    ButtonModule, DatePickerModule, InputTextModule, MessageModule
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private carService = inject(CarService);
  private store = inject(Store);

  car$!: Observable<Car>;
  bookingForm!: FormGroup;
  minDate = new Date();
  totalPrice = 0;

  ngOnInit() {
    const carId = Number(this.route.snapshot.paramMap.get('carId'));
    this.car$ = this.carService.getCar(carId);

    this.bookingForm = this.fb.group({
      dates: [null, [Validators.required]],
    });

    this.bookingForm.get('dates')?.valueChanges.subscribe(value => {
      if (value && value[0] && value[1]) {
        this.calculateTotal(value[0], value[1], carId);
      }
    });
  }

  private calculateTotal(start: Date, end: Date, carId: number) {
    this.car$.pipe(take(1)).subscribe(car => {
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      this.totalPrice = days * car.pricePerDay;
    });
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      const [start, end] = this.bookingForm.value.dates;
      const carId = Number(this.route.snapshot.paramMap.get('carId'));

      this.store.select(selectUser).pipe(take(1)).subscribe(user => {
        if (!user) {
          this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
          return;
        }

        const reservation = {
          userId: user.id,
          carId,
          startDate: start.toISOString(),
          endDate: end ? end.toISOString() : start.toISOString(),
          totalPrice: this.totalPrice,
          status: 'Confirmed' as const
        };

        this.store.dispatch(createReservation({ reservation }));
        this.router.navigate(['/catalog']); // Redirect after booking
      });
    }
  }
}
