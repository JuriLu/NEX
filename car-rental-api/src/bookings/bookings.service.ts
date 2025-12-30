import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  create(createBookingDto: CreateBookingDto) {
    const booking = this.bookingsRepository.create(createBookingDto);
    return this.bookingsRepository.save(booking);
  }

  findAll() {
    return this.bookingsRepository.find();
  }

  findOne(id: number) {
    return this.bookingsRepository.findOneBy({ id });
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    await this.bookingsRepository.update(id, updateBookingDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.bookingsRepository.delete(id);
  }
}
