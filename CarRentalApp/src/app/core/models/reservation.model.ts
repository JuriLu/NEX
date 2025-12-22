export interface Reservation {
  id: number;
  userId: number;
  carId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  currency: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}
