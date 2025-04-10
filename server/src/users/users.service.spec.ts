import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('../prisma/prisma.service'); // Mock du service Prisma

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockCreateUserDto = {
    email: 'test@example.com',
    password: 'password123',
    name: 'test'
  };

  const mockUser = {
    id: 'user1',
    email: 'test@example.com',
    password: 'hashedpassword',
    reservations: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should throw an error if the email is already taken', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser); // L'email est déjà pris

      await expect(service.create(mockCreateUserDto)).rejects.toThrowError(
        new BadRequestException("Cette email est déjà utilisée")
      );
    });

    it('should create a user with a hashed password', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null); // Aucun utilisateur avec cet email
      mockPrismaService.user.create.mockResolvedValue(mockUser); // Création réussie de l'utilisateur

      const result = await service.create(mockCreateUserDto);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: { ...mockCreateUserDto, password: expect.any(String) },
      });

      // Vérification que le mot de passe est haché
      expect(result.password).not.toBe(mockCreateUserDto.password);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(result).toEqual([mockUser]);
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should throw an error if user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null); // Aucun utilisateur trouvé

      await expect(service.findOne('nonexistent-id')).rejects.toThrowError(
        new BadRequestException("Cet utilisateur n'existe pas")
      );
    });

    it('should return a user if found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser); // L'utilisateur existe

      const result = await service.findOne('user1');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user1' },
        include: { reservations: true },
      });
    });
  });
});
