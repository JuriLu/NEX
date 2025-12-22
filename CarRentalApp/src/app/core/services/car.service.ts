import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Car } from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private http = inject(HttpClient);
  // URL to web api. 'api/cars' matches the InMemoryDbService "createDb" return key
  private carsUrl = 'api/cars';

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.carsUrl);
  }

  getCar(id: number): Observable<Car> {
    const url = `${this.carsUrl}/${id}`;
    return this.http.get<Car>(url);
  }

  addCar(car: Omit<Car, 'id'>): Observable<Car> {
    return this.http.post<Car>(this.carsUrl, car);
  }

  updateCar(car: Car): Observable<any> {
    return this.http.put(this.carsUrl, car);
  }

  deleteCar(id: number): Observable<any> {
    const url = `${this.carsUrl}/${id}`;
    return this.http.delete(url);
  }
}
