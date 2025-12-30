import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export type UserDocument = HydratedDocument<User>;
export type SafeUser = Omit<User, 'password'>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Number, unique: true, required: true, index: true })
  id: number;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ unique: true, required: true, trim: true })
  username: string;

  @Prop({ unique: true, required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);

const transformUser = (_doc: unknown, ret: any) => {
  delete ret._id;

  delete ret.__v;

  delete ret.password;
  return ret;
};

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: transformUser,
});

UserSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: transformUser,
});
