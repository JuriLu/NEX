import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SafeUser, User, UserDocument } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<SafeUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return this.sanitizeUser(user);
    }
    return null;
  }

  async login(
    user: SafeUser,
  ): Promise<{ access_token: string; user: SafeUser }> {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user,
    };
  }

  async register(userDto: CreateUserDto): Promise<SafeUser> {
    const newUser = await this.usersService.create(userDto);
    const safeUser = this.sanitizeUser(newUser);
    if (!safeUser) {
      throw new Error('Unable to sanitize newly created user');
    }
    return safeUser;
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const normalizedUsername = username?.trim();
    if (!normalizedUsername) {
      return false;
    }

    const existingUser =
      await this.usersService.findByUsername(normalizedUsername);
    return !existingUser;
  }

  private sanitizeUser(user: UserDocument | User | null): SafeUser | null {
    if (!user) {
      return null;
    }

    const plainUser =
      typeof (user as UserDocument).toObject === 'function'
        ? ((user as UserDocument).toObject() as User)
        : ({ ...user } as User);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = plainUser;
    return safeUser as SafeUser;
  }
}
