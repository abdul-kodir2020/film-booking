import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entity/auth.entity';
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
    it('should return an AuthEntity when login is successful', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
      const authEntity = new AuthEntity();
      jest.spyOn(authService, 'login').mockResolvedValue(authEntity);

      const result = await authController.login(loginDto);

      expect(result).toBe(authEntity);
      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    });

    it('should throw BadRequestException if login fails', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'wrongpassword' };
      jest.spyOn(authService, 'login').mockRejectedValue(new BadRequestException('Invalid credentials'));

      try {
        await authController.login(loginDto);
      } catch (e) {
        expect(e.response.message).toBe('Invalid credentials');
        expect(e.status).toBe(400);
      }
    });
  });

  describe('register', () => {
    it('should return a UserEntity when registration is successful', async () => {
      const createUserDto: CreateUserDto = { email: 'newuser@example.com', password: 'password', name: 'New User' };
      const userEntity = new UserEntity({
        email: 'newuser@example.com',
        password: 'password',
        name: 'New User',
      });
      jest.spyOn(usersService, 'create').mockResolvedValue(userEntity);
  
      const result = await authController.register(createUserDto);
  
      expect(result).toBeInstanceOf(UserEntity);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});
