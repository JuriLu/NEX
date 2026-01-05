import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus } from './enums/booking-status.enum';

describe('BookingsController', () => {
  let controller: BookingsController;

  const mockBooking = {
    id: 1,
    userId: 1,
    carId: 1,
    startDate: new Date(),
    endDate: new Date(),
    totalPrice: 500,
    status: BookingStatus.PENDING,
  };

  const mockBookingsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<BookingsController>(BookingsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new booking', async () => {
      const createBookingDto: CreateBookingDto = {
        userId: 1,
        carId: 1,
        startDate: new Date(),
        endDate: new Date(),
        totalPrice: 500,
      };

      mockBookingsService.create.mockResolvedValue(mockBooking);

      const result = await controller.create(createBookingDto);
      expect(result).toEqual(mockBooking);
      expect(mockBookingsService.create).toHaveBeenCalledWith(createBookingDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of bookings', async () => {
      mockBookingsService.findAll.mockResolvedValue([mockBooking]);

      const result = await controller.findAll();
      expect(result).toEqual([mockBooking]);
      expect(mockBookingsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single booking', async () => {
      mockBookingsService.findOne.mockResolvedValue(mockBooking);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockBooking);
      expect(mockBookingsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a booking', async () => {
      const updateBookingDto: UpdateBookingDto = { totalPrice: 600 };
      mockBookingsService.update.mockResolvedValue({
        ...mockBooking,
        totalPrice: 600,
      });

      const result = await controller.update('1', updateBookingDto);
      expect(result).toEqual({ ...mockBooking, totalPrice: 600 });
      expect(mockBookingsService.update).toHaveBeenCalledWith(
        1,
        updateBookingDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a booking', async () => {
      mockBookingsService.remove.mockResolvedValue(undefined);

      await controller.remove('1');
      expect(mockBookingsService.remove).toHaveBeenCalledWith(1);
    });
  });
});
