import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { Car, CarCategory, Currency } from '../../../core/models/car.model';
import { CarService } from '../../../core/services/car.service';
import { CarManagementComponent } from './car-management.component';

describe('CarManagementComponent', () => {
  let component: CarManagementComponent;
  let fixture: ComponentFixture<CarManagementComponent>;
  let carServiceMock: any;
  let confirmationServiceMock: any;
  let messageServiceMock: any;

  const mockCars: Car[] = [
    {
      id: 1,
      brand: 'Tesla',
      model: 'Model S',
      category: CarCategory.ELECTRIC,
      pricePerDay: 150,
      currency: Currency.USD,
      available: true,
      image: 'tesla.jpg',
      features: [],
    },
  ];

  beforeEach(async () => {
    carServiceMock = {
      getCars: vi.fn().mockReturnValue(of(mockCars)),
      addCar: vi.fn().mockReturnValue(of(mockCars[0])),
      updateCar: vi.fn().mockReturnValue(of(mockCars[0])),
      deleteCar: vi.fn().mockReturnValue(of({})),
    };

    confirmationServiceMock = {
      confirm: vi.fn().mockImplementation((config) => config.accept()),
    };

    messageServiceMock = {
      add: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CarManagementComponent, ReactiveFormsModule],
      providers: [
        { provide: CarService, useValue: carServiceMock },
        { provide: ConfirmationService, useValue: confirmationServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(CarManagementComponent, {
        set: {
          template: '<div></div>',
          providers: [
            { provide: ConfirmationService, useValue: confirmationServiceMock },
            { provide: MessageService, useValue: messageServiceMock },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CarManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cars on init', () => {
    expect(carServiceMock.getCars).toHaveBeenCalled();
    expect(component.cars).toEqual(mockCars);
  });

  it('should open dialog for new car', () => {
    component.openNew();
    expect(component.carDialog).toBe(true);
    expect(component.editingCar).toBeNull();
    expect(component.carForm.get('brand')?.value).toBeNull();
  });

  it('should open dialog for editing car', () => {
    component.editCar(mockCars[0]);
    expect(component.carDialog).toBe(true);
    expect(component.editingCar).toEqual(mockCars[0]);
    expect(component.carForm.get('brand')?.value).toBe('Tesla');
  });

  it('should call deleteCar service on confirmation', () => {
    component.deleteCar(mockCars[0]);
    expect(confirmationServiceMock.confirm).toHaveBeenCalled();
    expect(carServiceMock.deleteCar).toHaveBeenCalledWith(mockCars[0].id);
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ summary: 'Successful', detail: 'Car Deleted' })
    );
  });

  it('should save car when form is valid', () => {
    component.openNew();
    component.carForm.patchValue({
      brand: 'BMW',
      model: 'i4',
      category: CarCategory.ELECTRIC,
      pricePerDay: 120,
      currency: Currency.USD,
      available: true,
    });

    component.saveCar();

    expect(carServiceMock.addCar).toHaveBeenCalled();
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ detail: 'Car Created' })
    );
  });
});
