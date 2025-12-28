import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const users = [
       { id: 1, firstName: 'Admin', lastName: 'System', username: 'admin', email: 'admin@carrental.com', role: 'admin', password: 'admin' },
       { id: 2, firstName: 'Julian', lastName: 'NEX', username: 'julian', email: 'user@carrental.com', role: 'user', password: 'user' },
       { id: 3, firstName: 'Sarah', lastName: 'Connor', username: 'sconnor', email: 'sarah@skynet.com', role: 'user', password: 'user' },
       { id: 4, firstName: 'Rick', lastName: 'Deckard', username: 'deckard', email: 'rick@blade.run', role: 'user', password: 'user' }
    ];

    // Initial Mock Data for Cars
    const cars = [
       {
         id: 101,
         brand: 'Tesla',
         model: 'Model S Plaid',
         pricePerDay: 250,
         currency: 'USD',
         category: 'Electric',
         image: 'images/tesla.png',
         available: true,
         features: ['Autopilot', '0-60 in 1.99s', 'Range 396mi']
       },
       {
         id: 102,
         brand: 'BMW',
         model: 'M4 Competition',
         pricePerDay: 180,
         currency: 'USD',
         category: 'Sport',
         image: 'images/bmw.png',
         available: true,
         features: ['503 HP', 'Carbon Bucket Seats', 'Drift Mode']
       },
       {
         id: 103,
         brand: 'Mercedes-Benz',
         model: 'EQS SUV',
         pricePerDay: 300,
         currency: 'USD',
         category: 'Luxury',
         image: 'images/mercedes.png',
         available: true,
         features: ['Hyperscreen', 'Rear-Axle Steering', '7-Seat Luxury']
       }
    ];

    // Reservations table - Sample history
    const reservations: any[] = [
      {
        id: 1001,
        userId: 2,
        carId: 101,
        startDate: '2025-12-01',
        endDate: '2025-12-05',
        totalPrice: 1000,
        currency: 'USD',
        status: 'Completed'
      },
      {
        id: 1002,
        userId: 2,
        carId: 103,
        startDate: '2025-12-25',
        endDate: '2025-12-30',
        totalPrice: 1500,
        currency: 'USD',
        status: 'Confirmed'
      },
      {
        id: 1003,
        userId: 3,
        carId: 102,
        startDate: '2026-01-10',
        endDate: '2026-01-15',
        totalPrice: 900,
        currency: 'USD',
        status: 'Confirmed'
      }
    ];

    return { users, cars, reservations };
  }

  // Overrides genId to ensure that a car/user always has an id.
  // If the collection is empty, the method returns the initial number (101).
  // if the collection has items, it returns the highest id + 1.
  genId(collection: any[]): number {
    return collection.length > 0 ? Math.max(...collection.map(item => item.id)) + 1 : 101;
  }
}
