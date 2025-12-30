import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car, CarDocument } from './entities/car.entity';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car.name)
    private readonly carModel: Model<CarDocument>,
  ) {}

  private async getNextId(): Promise<number> {
    const latestCar = await this.carModel
      .findOne()
      .sort({ id: -1 })
      .select({ id: 1 })
      .lean<{ id: number }>()
      .exec();

    return latestCar?.id ? latestCar.id + 1 : 1;
  }

  async create(createCarDto: CreateCarDto): Promise<CarDocument> {
    const id = await this.getNextId();
    return this.carModel.create({ ...createCarDto, id });
  }

  findAll(): Promise<CarDocument[]> {
    return this.carModel.find().exec();
  }

  findOne(id: number): Promise<CarDocument | null> {
    return this.carModel.findOne({ id }).exec();
  }

  update(id: number, updateCarDto: UpdateCarDto): Promise<CarDocument | null> {
    return this.carModel
      .findOneAndUpdate({ id }, updateCarDto, { new: true })
      .exec();
  }

  async remove(id: number): Promise<void> {
    await this.carModel.deleteOne({ id }).exec();
  }
}
