import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
  ) {}

  create(createCarDto: CreateCarDto) {
    const car = this.carsRepository.create(createCarDto);
    return this.carsRepository.save(car);
  }

  findAll() {
    return this.carsRepository.find();
  }

  findOne(id: number) {
    return this.carsRepository.findOneBy({ id });
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    await this.carsRepository.update(id, updateCarDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.carsRepository.delete(id);
  }
}
