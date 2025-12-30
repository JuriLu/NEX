import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingDocument } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
  ) {}

  private async getNextId(): Promise<number> {
    const latestBooking = await this.bookingModel
      .findOne()
      .sort({ id: -1 })
      .select({ id: 1 })
      .lean<{ id: number }>()
      .exec();

    return latestBooking?.id ? latestBooking.id + 1 : 1;
  }

  async create(createBookingDto: CreateBookingDto): Promise<BookingDocument> {
    const id = await this.getNextId();
    const payload = {
      ...createBookingDto,
      id,
      startDate: new Date(createBookingDto.startDate),
      endDate: new Date(createBookingDto.endDate),
    };
    return this.bookingModel.create(payload);
  }

  findAll(): Promise<BookingDocument[]> {
    return this.bookingModel.find().exec();
  }

  findOne(id: number): Promise<BookingDocument | null> {
    return this.bookingModel.findOne({ id }).exec();
  }

  update(
    id: number,
    updateBookingDto: UpdateBookingDto,
  ): Promise<BookingDocument | null> {
    const payload = {
      ...updateBookingDto,
      ...(updateBookingDto.startDate && {
        startDate: new Date(updateBookingDto.startDate),
      }),
      ...(updateBookingDto.endDate && {
        endDate: new Date(updateBookingDto.endDate),
      }),
    };

    return this.bookingModel
      .findOneAndUpdate({ id }, payload, { new: true })
      .exec();
  }

  async remove(id: number): Promise<void> {
    await this.bookingModel.deleteOne({ id }).exec();
  }
}
