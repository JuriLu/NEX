import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  private async getNextId(): Promise<number> {
    const latestUser = await this.userModel
      .findOne()
      .sort({ id: -1 })
      .select({ id: 1 })
      .lean<{ id: number }>()
      .exec();

    return latestUser?.id ? latestUser.id + 1 : 1;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const id = await this.getNextId();
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const payload = {
      ...createUserDto,
      id,
      password: hashedPassword,
      email: createUserDto.email.trim().toLowerCase(),
      username: createUserDto.username.trim(),
    };
    return this.userModel.create(payload);
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: number): Promise<UserDocument | null> {
    return this.userModel.findOne({ id }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.trim().toLowerCase() }).exec();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username: username.trim() }).exec();
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    const payload: UpdateUserDto = { ...updateUserDto };
    if (payload.email) {
      payload.email = payload.email.trim().toLowerCase();
    }
    if (payload.username) {
      payload.username = payload.username.trim();
    }

    return this.userModel
      .findOneAndUpdate({ id }, payload, { new: true })
      .exec();
  }

  async updatePassword(
    id: number,
    { currentPassword, newPassword }: UpdatePasswordDto,
  ): Promise<UserDocument> {
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    return user.save();
  }

  async remove(id: number): Promise<void> {
    await this.userModel.deleteOne({ id }).exec();
  }
}
