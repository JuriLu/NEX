import { HttpClient } from '@angular/common/http';
import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import 'zone.js';
import 'zone.js/testing';
import { Car, CarCategory, Currency } from '../models/car.model';
import { CarService } from './car.service';

describe('CarService', () => {
  let service: CarService;
  let httpClientMock: any;

  const mockCars: Car[] = [
    {
      id: 1,
      brand: 'Tesla',
      model: 'Model S',
      pricePerDay: 150,
      currency: Currency.USD,
      category: CarCategory.ELECTRIC,
      image: 'tesla.jpg',
      available: true,
      features: ['Autopilot', 'Ludicrous Mode'],
    },
    {
      id: 2,
      brand: 'BMW',
      model: 'M3',
      pricePerDay: 120,
      currency: Currency.USD,
      category: CarCategory.SPORT,
      image: 'bmw.jpg',
      available: true,
      features: ['Sport Exhaust', 'Track Package'],
    },
  ];

  beforeEach(() => {
    httpClientMock = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [CarService, { provide: HttpClient, useValue: httpClientMock }],
    });

    service = TestBed.inject(CarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCars', () => {
    it('should return an observable of cars', () => {
      httpClientMock.get.mockReturnValue(of(mockCars));

      service.getCars().subscribe((cars) => {
        expect(cars).toEqual(mockCars);
      });

      expect(httpClientMock.get).toHaveBeenCalledWith(expect.stringContaining('/cars'));
    });
  });

  describe('getCar', () => {
    it('should return a single car by id', () => {
      const mockCar = mockCars[0];
      httpClientMock.get.mockReturnValue(of(mockCar));

      service.getCar(1).subscribe((car) => {
        expect(car).toEqual(mockCar);
      });

      expect(httpClientMock.get).toHaveBeenCalledWith(expect.stringContaining('/cars/1'));
    });
  });

  describe('addCar', () => {
    it('should send a POST request to add a car', () => {
      const newCar: Omit<Car, 'id'> = {
        brand: 'Honda',
        model: 'Civic',
        pricePerDay: 50,
        currency: Currency.USD,
        category: CarCategory.SEDAN,
        image: 'civic.jpg',
        available: true,
        features: ['Fuel Efficient'],
      };
      const createdCar = { id: 3, ...newCar };
      httpClientMock.post.mockReturnValue(of(createdCar));

      service.addCar(newCar).subscribe((car) => {
        expect(car).toEqual(createdCar);
      });

      expect(httpClientMock.post).toHaveBeenCalledWith(expect.stringContaining('/cars'), newCar);
    });
  });

  describe('updateCar', () => {
    it('should send a PATCH request to update a car', () => {
      const updatedCar = { ...mockCars[0], pricePerDay: 160 };
      httpClientMock.patch.mockReturnValue(of(updatedCar));

      service.updateCar(updatedCar).subscribe((car) => {
        expect(car).toEqual(updatedCar);
      });

      expect(httpClientMock.patch).toHaveBeenCalledWith(
        expect.stringContaining('/cars/1'),
        updatedCar
      );
    });
  });

  describe('deleteCar', () => {
    it('should send a DELETE request to remove a car', () => {
      httpClientMock.delete.mockReturnValue(of(undefined));

      service.deleteCar(1).subscribe(() => {
        // Assert success
      });

      expect(httpClientMock.delete).toHaveBeenCalledWith(expect.stringContaining('/cars/1'));
    });
  });
});
