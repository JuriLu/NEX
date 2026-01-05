import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: 1,
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedPassword',
    role: UserRole.USER,
    toObject: jest.fn().mockReturnValue({
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashedPassword',
      role: UserRole.USER,
    }),
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password if validation succeeds', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).not.toBeNull();
      expect(result?.email).toBe('test@example.com');
      expect(result).not.toHaveProperty('password');
    });

    it('should return null if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      const result = await service.validateUser(
        'notfound@example.com',
        'password',
      );
      expect(result).toBeNull();
    });

    it('should return null if password mismatch', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      mockJwtService.signAsync.mockResolvedValue('jwt_token');
      // Simulated safe user (no password)
      const safeUser: any = { ...mockUser };
      delete safeUser.password;
      delete safeUser.toObject;

      const result = await service.login(safeUser);
      expect(result).toEqual({
        access_token: 'jwt_token',
        user: safeUser,
      });
      expect(mockJwtService.signAsync).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should register a new user and return safe user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        password: 'password',
        role: UserRole.USER,
      };

      const createdUser = {
        ...mockUser,
        ...createUserDto,
        id: 2,
        password: 'hashed',
      };
      // Adding toObject for sanitization check
      (createdUser as any).toObject = () => {
        const { password, ...rest } = createdUser;
        return rest; // returns object without password but WITH toObject removed effectively by logic
      };
      // Actually toObject usually returns the POJO, let's simplify logic in mock to match service
      mockUsersService.create.mockResolvedValue(createdUser as any);

      const result = await service.register(createUserDto);

      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('john@example.com');
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw error if sanitization fails', async () => {
      mockUsersService.create.mockResolvedValue(null);
      await expect(service.register({} as any)).rejects.toThrow(
        'Unable to sanitize newly created user',
      );
    });
  });

  describe('isUsernameAvailable', () => {
    it('should return true if username is available (user not found)', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);
      const result = await service.isUsernameAvailable('newuser');
      expect(result).toBe(true);
    });

    it('should return false if username is taken (user found)', async () => {
      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      const result = await service.isUsernameAvailable('testuser');
      expect(result).toBe(false);
    });

    it('should return false if username is empty', async () => {
      const result = await service.isUsernameAvailable(' ');
      expect(result).toBe(false);
    });
  });
});
