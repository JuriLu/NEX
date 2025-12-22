export interface Car {
  id: number;
  brand: string;
  model: string;
  pricePerDay: number;
  currency?: string;
  category: 'Electric' | 'Sport' | 'Luxury' | 'SUV' | 'Sedan';
  image: string;
  available: boolean;
  features: string[];
}
