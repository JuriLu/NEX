import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Car, CarCategory, Currency } from '../../core/models/car.model';
import { CarService } from '../../core/services/car.service';
import { CatalogComponent } from './catalog.component';

describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;
  let carServiceMock: any;

  const mockCars: Car[] = [
    {
      id: 1,
      brand: 'Tesla',
      model: 'Model S',
      pricePerDay: 150,
      available: true,
      category: CarCategory.ELECTRIC,
      image: 'tesla.jpg',
      features: [],
      currency: Currency.USD,
    },
  ];

  beforeEach(async () => {
    carServiceMock = {
      getCars: vi.fn().mockReturnValue(of(mockCars)),
    };

    await TestBed.configureTestingModule({
      imports: [CatalogComponent],
      providers: [
        { provide: CarService, useValue: carServiceMock },
        {
          provide: ActivatedRoute,
          useValue: { params: of({}) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(CatalogComponent, {
        set: { template: '<div></div>' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cars on init', () => {
    expect(carServiceMock.getCars).toHaveBeenCalled();
    component.cars$.subscribe((cars) => {
      expect(cars).toEqual(mockCars);
    });
  });

  describe('getSeverity', () => {
    it('should return success when car is available', () => {
      const car = { ...mockCars[0], available: true };
      expect(component.getSeverity(car)).toBe('success');
    });

    it('should return danger when car is not available', () => {
      const car = { ...mockCars[0], available: false };
      expect(component.getSeverity(car)).toBe('danger');
    });
  });
});
