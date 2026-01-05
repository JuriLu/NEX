import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarCategory } from './entities/car.entity';

describe('CarsController', () => {
  let controller: CarsController;

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

  const mockCarsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarsController],
      providers: [
        {
          provide: CarsService,
          useValue: mockCarsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CarsController>(CarsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new car', async () => {
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

      mockCarsService.create.mockResolvedValue(mockCar);

      const result = await controller.create(createCarDto);
      expect(result).toEqual(mockCar);
      expect(mockCarsService.create).toHaveBeenCalledWith(createCarDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of cars', async () => {
      mockCarsService.findAll.mockResolvedValue([mockCar]);

      const result = await controller.findAll();
      expect(result).toEqual([mockCar]);
      expect(mockCarsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single car', async () => {
      mockCarsService.findOne.mockResolvedValue(mockCar);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockCar);
      expect(mockCarsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a car', async () => {
      const updateCarDto: UpdateCarDto = { pricePerDay: 55 };
      mockCarsService.update.mockResolvedValue({ ...mockCar, ...updateCarDto });

      const result = await controller.update('1', updateCarDto);
      expect(result).toEqual({ ...mockCar, pricePerDay: 55 });
      expect(mockCarsService.update).toHaveBeenCalledWith(1, updateCarDto);
    });
  });

  describe('remove', () => {
    it('should remove a car', async () => {
      mockCarsService.remove.mockResolvedValue(undefined);

      await controller.remove('1');
      expect(mockCarsService.remove).toHaveBeenCalledWith(1);
    });
  });
});
