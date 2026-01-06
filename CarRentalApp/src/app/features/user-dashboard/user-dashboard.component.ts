import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
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

  private store = inject(Store);
  private carService = inject(CarService);

  userBookings$!: Observable<any[]>;

  ngOnInit() {
    this.store.dispatch(loadReservations());

    const reservations$ = this.store.select(selectAllReservations);
    const cars$ = this.carService.getCars();
    const user$ = this.store.select(selectUser);

    this.userBookings$ = combineLatest([reservations$, cars$, user$]).pipe(
      map(([reservations, cars, user]) => {
        if (!user) return [];

        return reservations
          .filter((res) => res.userId === user.id)
          .map((res) => ({
            ...res,
            car: cars.find((c) => c.id === res.carId),
          }));
      })
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
