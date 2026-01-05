import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { BookingStatus } from './enums/booking-status.enum';

describe('BookingsService', () => {
  let service: BookingsService;

  const mockBooking = {
    id: 1,
    userId: 1,
    carId: 1,
    startDate: new Date('2023-10-01T10:00:00Z'),
    endDate: new Date('2023-10-05T10:00:00Z'),
    totalPrice: 500,
    status: BookingStatus.PENDING,
  };

  const mockBookingModel = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getModelToken(Booking.name),
          useValue: mockBookingModel,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new booking with auto-incremented ID and date conversion', async () => {
      const createBookingDto: CreateBookingDto = {
        userId: 1,
        carId: 1,
        startDate: '2023-10-01T10:00:00Z' as any,
        endDate: '2023-10-05T10:00:00Z' as any,
        totalPrice: 500,
      };

      mockBookingModel.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue({ id: 10 }),
            }),
          }),
        }),
      });

      mockBookingModel.create.mockResolvedValue({
        ...createBookingDto,
        id: 11,
      });

      const result = await service.create(createBookingDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(11);
      expect(mockBookingModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 11,
          startDate: expect.any(Date),
          endDate: expect.any(Date),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of bookings', async () => {
      mockBookingModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockBooking]),
      });

      const result = await service.findAll();
      expect(result).toEqual([mockBooking]);
    });
  });

  describe('findOne', () => {
    it('should return a single booking', async () => {
      mockBookingModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBooking),
      });

      const result = await service.findOne(1);
      expect(result).toEqual(mockBooking);
      expect(mockBookingModel.findOne).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('update', () => {
    it('should update a booking with date conversion', async () => {
      const updateBookingDto: UpdateBookingDto = {
        startDate: '2023-11-01T10:00:00Z' as any,
      };
      const updatedBooking = {
        ...mockBooking,
        startDate: new Date('2023-11-01T10:00:00Z'),
      };

      mockBookingModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedBooking),
      });

      const result = await service.update(1, updateBookingDto);
      expect(result).toEqual(updatedBooking);
      expect(mockBookingModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 1 },
        expect.objectContaining({
          startDate: expect.any(Date),
        }),
        { new: true },
      );
    });
  });

  describe('remove', () => {
    it('should remove the booking', async () => {
      mockBookingModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      await service.remove(1);
      expect(mockBookingModel.deleteOne).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
