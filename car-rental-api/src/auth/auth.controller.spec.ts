import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser = {
    id: 1,
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    username: 'testuser',
    role: UserRole.USER,
  };

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    isUsernameAvailable: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access token', async () => {
      const resultToken = { access_token: 'jwt_token', user: mockUser };
      mockAuthService.login.mockResolvedValue(resultToken);

      const req = { user: mockUser };
      const result = await controller.login(req as any);

      expect(result).toEqual(resultToken);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        password: 'password',
        role: UserRole.USER,
      };

      mockAuthService.register.mockResolvedValue(mockUser);

      const result = await controller.register(createUserDto);
      expect(result).toEqual(mockUser);
      expect(mockAuthService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('checkUsername', () => {
    it('should return availability status', async () => {
      mockAuthService.isUsernameAvailable.mockResolvedValue(true);

      const result = await controller.checkUsername('newuser');
      expect(result).toEqual({ isAvailable: true });
      expect(mockAuthService.isUsernameAvailable).toHaveBeenCalledWith(
        'newuser',
      );
    });
  });
});
