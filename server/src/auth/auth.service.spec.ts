import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return a token when login is successful', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };

      // Mock user object that matches the type expected by Prisma
      const mockUser = {
        id: 'user-id-123',
        email: 'test@example.com',
        password: 'hashedpassword', // Hashed password
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true))

      // Mock PrismaService's user.findUnique method to return the mock user
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      // Mock JWT token generation
      const mockToken = 'jwt-token';
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await authService.login(loginDto.email, loginDto.password);

      expect(result).toEqual({ token: mockToken });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: loginDto.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({ userId: mockUser.id }, { expiresIn: '4h' });
    });

    it('should throw BadRequestException if user does not exist', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null); // No user found

      try {
        await authService.login(loginDto.email, loginDto.password);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.response.message).toBe('Email ou Mot de passe incorrecte !');
      }
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };

      const mockUser = {
        id: 'user-id-123',
        email: 'test@example.com',
        password: 'hashedpassword', // Hashed password
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false))

      try {
        await authService.login(loginDto.email, loginDto.password);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.response.message).toBe('Email ou Mot de passe incorrecte !');
      }
    });
  });
});
