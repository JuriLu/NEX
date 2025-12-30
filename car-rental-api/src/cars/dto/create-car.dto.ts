import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CarCategory } from '../entities/car.entity';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  pricePerDay: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsEnum(CarCategory)
  category: CarCategory;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @IsArray()
  @IsString({ each: true })
  features: string[];
}
