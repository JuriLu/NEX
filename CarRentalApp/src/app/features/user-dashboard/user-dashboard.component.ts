import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { Car } from '../../core/models/car.model';
import { Reservation } from '../../core/models/reservation.model';
import { User } from '../../core/models/user.model';
import { CarService } from '../../core/services/car.service';
import { selectUser } from '../../core/store/auth/auth.selectors';
import { loadReservations } from '../../core/store/booking/booking.actions';
import { selectAllReservations } from '../../core/store/booking/booking.selectors';

import { RouterLink } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { DESIGN_SYSTEM } from '../../shared/theme/design-system';

export const USER_DASHBOARD_STYLES = {
  missionRow: ['mission-row'],
  carUnitImg: ['car-unit-img', 'glass-panel', 'mr-4'],
  tableContainer: ['glass-panel', 'overflow-hidden', 'fadeinup', 'animation-duration-1000'],
  tableHeader: ['uppercase', 'tracking-widest', 'text-xs', 'font-bold', 'text-secondary'],
};

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, CardModule, RouterLink, ButtonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent implements OnInit {
  readonly theme = DESIGN_SYSTEM;

  readonly styles = USER_DASHBOARD_STYLES;

  private store: Store = inject(Store);
  private carService: CarService = inject(CarService);

  userBookings$!: Observable<(Reservation & { car?: Car })[]>;

  ngOnInit(): void {
    this.store.dispatch(loadReservations());

    const reservations$: Observable<Reservation[]> = this.store.select(selectAllReservations);
    const cars$: Observable<Car[]> = this.carService.getCars();
    const user$: Observable<User | null> = this.store.select(selectUser);

    this.userBookings$ = combineLatest([reservations$, cars$, user$]).pipe(
      map(
        ([reservations, cars, user]: [Reservation[], Car[], User | null]): (Reservation & {
          car?: Car;
        })[] => {
          if (!user) return [];

          return reservations
            .filter((res: Reservation) => res.userId === user.id)
            .map((res: Reservation) => ({
              ...res,
              car: cars.find((c: Car) => c.id === res.carId),
            }));
        }
      )
    );
  }

  getSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Pending':
        return 'info';
      case 'Cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
