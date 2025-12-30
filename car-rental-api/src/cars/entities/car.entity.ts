import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum CarCategory {
  ELECTRIC = 'Electric',
  SPORT = 'Sport',
  LUXURY = 'Luxury',
  SUV = 'SUV',
  SEDAN = 'Sedan',
  CONVERTIBLE = 'Convertible',
}

export type CarDocument = HydratedDocument<Car>;

@Schema({ timestamps: true })
export class Car {
  @Prop({ type: Number, unique: true, required: true, index: true })
  id: number;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  pricePerDay: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ type: String, enum: CarCategory, required: true })
  category: CarCategory;

  @Prop({ required: true })
  image: string;

  @Prop({ default: true })
  available: boolean;

  @Prop({ type: [String], default: [] })
  features: string[];
}

export const CarSchema = SchemaFactory.createForClass(Car);

const transformDocument = (_doc: unknown, ret: any) => {
  delete ret._id;

  delete ret.__v;
  return ret;
};

CarSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: transformDocument,
});

CarSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: transformDocument,
});
