import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BookingStatus } from '../enums/booking-status.enum';

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Number, unique: true, required: true, index: true })
  id: number;

  @Prop({ type: Number, required: true })
  userId: number;

  @Prop({ type: Number, required: true })
  carId: number;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ type: String, enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

const transformBooking = (_doc: unknown, ret: any) => {
  delete ret._id;

  delete ret.__v;
  return ret;
};

BookingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: transformBooking,
});

BookingSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: transformBooking,
});
