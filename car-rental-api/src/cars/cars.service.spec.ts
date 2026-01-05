import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car, CarCategory } from './entities/car.entity';

describe('CarsService', () => {
  let service: CarsService;

  const mockCar = {
    id: 1,
    brand: 'Toyota',
    model: 'Corolla',
    pricePerDay: 50,
    available: true,
    category: CarCategory.SEDAN,
    image: 'car.jpg',
    features: ['Air Conditioning'],
    currency: 'USD',
  };

  const mockCarModel = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarsService,
        {
          provide: getModelToken(Car.name),
          useValue: mockCarModel,
        },
      ],
    }).compile();

    service = module.get<CarsService>(CarsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new car with auto-incremented ID', async () => {
      const createCarDto: CreateCarDto = {
        brand: 'Honda',
        model: 'Civic',
        pricePerDay: 60,
        available: true,
        category: CarCategory.SEDAN,
        image: 'civic.jpg',
        features: ['GPS'],
        currency: 'USD',
      };

      mockCarModel.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue({ id: 10 }),
            }),
          }),
        }),
      });

      mockCarModel.create.mockResolvedValue({
        ...createCarDto,
        id: 11,
      });

      const result = await service.create(createCarDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(11);
      expect(mockCarModel.create).toHaveBeenCalledWith({
        ...createCarDto,
        id: 11,
      });
    });

    it('should assign ID 1 if no cars exist', async () => {
      const createCarDto: CreateCarDto = {
        brand: 'Tesla',
        model: 'Model 3',
        pricePerDay: 100,
        available: true,
        category: CarCategory.ELECTRIC,
        image: 'tesla.jpg',
        features: ['Autopilot'],
        currency: 'USD',
      };

      mockCarModel.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(null),
            }),
          }),
        }),
      });

      mockCarModel.create.mockResolvedValue({
        ...createCarDto,
        id: 1,
      });

      const result = await service.create(createCarDto);
      expect(result.id).toBe(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of cars', async () => {
      const cars = [mockCar];
      mockCarModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(cars),
      });

      const result = await service.findAll();
      expect(result).toEqual(cars);
    });
  });

  describe('findOne', () => {
    it('should return a single car', async () => {
      mockCarModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCar),
      });

      const result = await service.findOne(1);
      expect(result).toEqual(mockCar);
      expect(mockCarModel.findOne).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('update', () => {
    it('should update and return the car', async () => {
      const updateCarDto: UpdateCarDto = { pricePerDay: 55 };
      const updatedCar = { ...mockCar, pricePerDay: 55 };

      mockCarModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedCar),
      });

      const result = await service.update(1, updateCarDto);
      expect(result).toEqual(updatedCar);
      expect(mockCarModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 1 },
        updateCarDto,
        { new: true },
      );
    });
  });

  describe('remove', () => {
    it('should remove the car', async () => {
      mockCarModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      await service.remove(1);
      expect(mockCarModel.deleteOne).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
