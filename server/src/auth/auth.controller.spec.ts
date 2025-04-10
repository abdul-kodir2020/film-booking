import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('login', () => {
    it('should return a token and message when login is successful', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
      const mockToken = 'mocked.token.jwt';

      jest.spyOn(authService, 'login').mockResolvedValue({ token: mockToken });

      const result = await authController.login(loginDto);

      expect(result).toEqual({
        token: mockToken,
        message: 'Connexion réussie',
      });
      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    });

    it('should throw BadRequestException if login fails', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'wrongpassword' };
      jest.spyOn(authService, 'login').mockRejectedValue(new BadRequestException('Invalid credentials'));

      await expect(authController.login(loginDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('register', () => {
    it('should return a user and message when registration is successful', async () => {
      const createUserDto: CreateUserDto = {
        email: 'newuser@example.com',
        password: 'password',
        name: 'New User',
      };

      const mockUser = {
        id: 'user-id',
        email: createUserDto.email,
        name: createUserDto.name,
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);

      const result = await authController.register(createUserDto);

      expect(result).toEqual({
        user: new UserEntity(mockUser),
        message: 'Inscription reussie',
      });

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});
