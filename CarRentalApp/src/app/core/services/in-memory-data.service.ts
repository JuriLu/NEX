import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const users = [
       { id: 1, name: 'Admin', email: 'admin@carrental.com', role: 'admin', password: 'admin' }, // Plaintext for mock only
       { id: 2, name: 'User', email: 'user@carrental.com', role: 'user', password: 'user' }
    ];

    // Initial Mock Data for Cars - Will be expanded
    const cars = [
       {
         id: 101,
         brand: 'Tesla',
         model: 'Model S Plaid',
         pricePerDay: 250,
         category: 'Electric',
         image: 'assets/images/tesla.png',
         available: true,
         features: ['Autopilot', '0-60 in 1.99s', 'Range 396mi']
       },
       {
         id: 102,
         brand: 'BMW',
         model: 'M4 Competition',
         pricePerDay: 180,
         category: 'Sport',
         image: 'assets/images/bmw.png',
         available: true,
         features: ['503 HP', 'Carbon Bucket Seats', 'Drift Mode']
       },
       {
         id: 103,
         brand: 'Mercedes',
         model: 'S-Class',
         pricePerDay: 300,
         category: 'Luxury',
         image: 'assets/images/mercedes.png',
         available: true,
         features: ['Massage Seats', 'Ambient Lighting', 'Chauffeur Package']
       }
    ];

    // Reservations table
    const reservations: any[] = [];

    return { users, cars, reservations };
  }

  // Overrides genId to ensure that a car/user always has an id.
  // If the collection is empty, the method returns the initial number (101).
  // if the collection has items, it returns the highest id + 1.
  genId(collection: any[]): number {
    return collection.length > 0 ? Math.max(...collection.map(item => item.id)) + 1 : 101;
  }
}
