import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

// PrimeNG
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';

// Internal
import { Car } from '../../core/models/car.model';
import { CarService } from '../../core/services/car.service';

import { DESIGN_SYSTEM } from '../../shared/theme/design-system';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DataViewModule,
    ButtonModule,
    TagModule,
    RatingModule,
    FormsModule,
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit {
  readonly theme = DESIGN_SYSTEM;

  readonly styles = {
    carCard: [
      'p-card',
      'car-card',
      'flex',
      'flex-column',
      'h-full',
      'glass-panel',
      'hover-glow',
      'transition-all',
    ],
    pricePill: ['price-pill', 'glass-panel', 'px-3', 'py-1', 'mt-1'],
    emptyState: ['text-center', 'p-8', 'glass-panel', 'border-round-xl'],
    gridCol: ['col-12', 'sm:col-6', 'md:col-4', 'lg:col-4', 'xl:col-4', 'p-3'],
  };

  private carService = inject(CarService);

  cars$!: Observable<Car[]>;

  ngOnInit() {
    this.cars$ = this.carService.getCars();
  }

  getSeverity(car: Car): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    return car.available ? 'success' : 'danger';
  }
}
