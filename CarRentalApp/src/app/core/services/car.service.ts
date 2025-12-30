import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Car } from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private http = inject(HttpClient);
  private readonly carsUrl = `${environment.apiUrl}/cars`;

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

  updateCar(car: Car): Observable<Car> {
    return this.http.patch<Car>(`${this.carsUrl}/${car.id}`, car);
  }

  deleteCar(id: number): Observable<void> {
    const url = `${this.carsUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
