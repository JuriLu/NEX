import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CarCategory } from '../entities/car.entity';

export class CreateCarDto {
  @ApiProperty({ example: 'Tesla' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'Model S' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 150 })
  @IsNumber()
  pricePerDay: number;

  @ApiProperty({ example: 'USD', required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ enum: CarCategory, example: CarCategory.ELECTRIC })
  @IsEnum(CarCategory)
  category: CarCategory;

  @ApiProperty({ example: 'https://example.com/car.jpg' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @ApiProperty({ example: ['GPS', 'Autopilot'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  features: string[];
}
