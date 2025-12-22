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

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, DataViewModule, ButtonModule, TagModule, RatingModule, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
  private carService = inject(CarService);

  cars$!: Observable<Car[]>;

  ngOnInit() {
    this.cars$ = this.carService.getCars();
  }

  getSeverity(car: Car): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" {
    return car.available ? 'success' : 'danger';
  }
}
