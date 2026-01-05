import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Reservation, ReservationStatus } from '../models/reservation.model';
import { ReservationService } from './reservation.service';

describe('ReservationService', () => {
  let service: ReservationService;
  let httpClientMock: any;

  const mockReservations: Reservation[] = [
    {
      id: 1,
      userId: 1,
      carId: 1,
      startDate: '2023-10-01',
      endDate: '2023-10-05',
      totalPrice: 500,
      currency: 'USD',
      status: ReservationStatus.PENDING,
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
      providers: [ReservationService, { provide: HttpClient, useValue: httpClientMock }],
    });

    service = TestBed.inject(ReservationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getReservations', () => {
    it('should return normalized reservations', () => {
      httpClientMock.get.mockReturnValue(of([{ ...mockReservations[0], status: undefined }]));

      service.getReservations().subscribe((reservations) => {
        expect(reservations[0].status).toBe(ReservationStatus.PENDING);
      });
    });
  });

  describe('getUserReservations', () => {
    it('should filter reservations by userId', () => {
      httpClientMock.get.mockReturnValue(
        of([mockReservations[0], { ...mockReservations[0], id: 2, userId: 2 }])
      );

      service.getUserReservations(1).subscribe((res) => {
        expect(res.length).toBe(1);
        expect(res[0].userId).toBe(1);
      });
    });
  });

  describe('createReservation', () => {
    it('should send POST request and return normalized reservation', () => {
      const newRes = {
        userId: 1,
        carId: 2,
        startDate: '2023-11-01',
        endDate: '2023-11-05',
        totalPrice: 200,
      };
      httpClientMock.post.mockReturnValue(of({ ...newRes, id: 3 }));

      service.createReservation(newRes as any).subscribe((res) => {
        expect(res.id).toBe(3);
        expect(res.status).toBe(ReservationStatus.PENDING);
      });
    });
  });

  describe('updateReservationStatus', () => {
    it('should send PATCH request to update status', () => {
      httpClientMock.patch.mockReturnValue(
        of({ ...mockReservations[0], status: ReservationStatus.CONFIRMED })
      );

      service.updateReservationStatus(1, ReservationStatus.CONFIRMED).subscribe((res) => {
        expect(res.status).toBe(ReservationStatus.CONFIRMED);
      });

      expect(httpClientMock.patch).toHaveBeenCalledWith(expect.stringContaining('/bookings/1'), {
        status: ReservationStatus.CONFIRMED,
      });
    });
  });

  describe('deleteReservation', () => {
    it('should send DELETE request', () => {
      httpClientMock.delete.mockReturnValue(of(undefined));

      service.deleteReservation(1).subscribe();

      expect(httpClientMock.delete).toHaveBeenCalledWith(expect.stringContaining('/bookings/1'));
    });
  });
});
