import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    id: 1,
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedPassword',
    role: UserRole.USER,
    save: jest.fn(),
  };

  const mockUserModel = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with hashed password and auto-incremented ID', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        password: 'password123',
        role: UserRole.USER,
      };

      // Mock getNextId internal logic by mocking findOne for the latest user
      mockUserModel.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue({ id: 10 }),
            }),
          }),
        }),
      });

      mockUserModel.create.mockResolvedValue({
        ...createUserDto,
        id: 11,
        password: 'hashed_password123',
      });

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => 'hashed_password123');

      const result = await service.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(11);
      expect(result.password).toBe('hashed_password123');
      expect(mockUserModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 11,
          email: 'john@example.com',
          username: 'johndoe',
        }),
      );
    });

    it('should assign ID 1 if no users exist', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        password: 'password123',
        role: UserRole.USER,
      };

      mockUserModel.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(null),
            }),
          }),
        }),
      });

      mockUserModel.create.mockResolvedValue({
        ...createUserDto,
        id: 1,
      });

      const result = await service.create(createUserDto);
      expect(result.id).toBe(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockUserModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(users),
      });

      const result = await service.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if user not found', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email (case insensitive behavior mocked)', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      await service.findByEmail(' Test@Example.com ');
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });
  });

  describe('findByUsername', () => {
    it('should find user by username', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      await service.findByUsername(' testuser ');
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        username: 'testuser',
      });
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'Updated' };
      const updatedUser = { ...mockUser, firstName: 'Updated' };

      mockUserModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.update(1, updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 1 },
        updateUserDto,
        { new: true },
      );
    });

    it('should trim email and username if provided', async () => {
      const dto: UpdateUserDto = {
        email: ' NEW@mail.com ',
        username: ' NEWUSER ',
      };

      mockUserModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      await service.update(1, dto);
      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 1 },
        { email: 'new@mail.com', username: 'NEWUSER' },
        { new: true },
      );
    });
  });

  describe('updatePassword', () => {
    it('should update password if current password is correct', async () => {
      const dto: UpdatePasswordDto = {
        currentPassword: 'password123',
        newPassword: 'newPassword123',
      };
      // User found
      const userInstance = {
        ...mockUser,
        save: jest.fn().mockResolvedValue(true),
      };

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(userInstance),
      });

      // Bcrypt compare success
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      // Bcrypt hash
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => 'new_hashed_password');

      await service.updatePassword(1, dto);

      expect(userInstance.password).toBe('new_hashed_password');
      expect(userInstance.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updatePassword(1, { currentPassword: 'a', newPassword: 'b' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if current password is incorrect', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(
        service.updatePassword(1, {
          currentPassword: 'wrong',
          newPassword: 'b',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove the user', async () => {
      mockUserModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      await service.remove(1);
      expect(mockUserModel.deleteOne).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
