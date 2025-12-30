import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BookingStatus } from '../enums/booking-status.enum';

export class CreateBookingDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  carId: number;

  @ApiProperty({ example: '2023-10-01T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2023-10-05T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @ApiProperty({ example: 'USD', required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.PENDING,
    required: false,
  })
  @IsEnum(BookingStatus as object)
  @IsOptional()
  status?: BookingStatus;
}
