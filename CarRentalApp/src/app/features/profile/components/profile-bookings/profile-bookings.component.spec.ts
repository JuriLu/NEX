import { ProfileBookingsComponent } from './profile-bookings.component';

describe('ProfileBookingsComponent', () => {
  let component: ProfileBookingsComponent;

  beforeEach(() => {
    component = new ProfileBookingsComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle empty bookings', () => {
    component.bookings = [];
    expect(component.bookings).toBeDefined();
    expect(component.bookings?.length).toBe(0);
  });

  it('should accept bookings array and expose values', () => {
    component.bookings = [
      {
        car: { brand: 'Tesla', model: 'Model S', image: 'img.png' },
        startDate: new Date('2025-12-01'),
        endDate: new Date('2025-12-05'),
        totalPrice: 1000,
        currency: 'USD',
        status: 'Confirmed',
      },
    ];

    expect(component.bookings?.length).toBe(1);
    expect(component.bookings?.[0].car.brand).toBe('Tesla');
  });

  it('should return correct severity for statuses', () => {
    expect(component.getBookingSeverity('Confirmed')).toBe('success');
    expect(component.getBookingSeverity('Pending')).toBe('info');
    expect(component.getBookingSeverity('Cancelled')).toBe('danger');
    expect(component.getBookingSeverity('Completed')).toBe('secondary');
    expect(component.getBookingSeverity('Unknown')).toBe('info');
  });
});
