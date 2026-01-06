export enum CarCategory {
  ELECTRIC = 'Electric',
  SPORT = 'Sport',
  LUXURY = 'Luxury',
  SUV = 'SUV',
  SEDAN = 'Sedan',
  CONVERTIBLE = 'Convertible'
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP'
}

export interface Car {
  id: number;
  brand: string;
  model: string;
  pricePerDay: number;
  currency?: Currency;
  category: CarCategory;
  image: string;
  available: boolean;
  features: string[];
}

