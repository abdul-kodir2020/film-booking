import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BadRequestException } from '@nestjs/common';
import { getMockRequest } from '../utils/mock-request'; // Utilitaire pour créer des mocks de la requête
import { UserEntity } from './entities/user.entity';

jest.mock('./users.service'); // Mock du UsersService

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 'user1',
    email: 'test@example.com',
    password: 'hashedpassword',
    reservations: [],
  };

  const mockUsers = [mockUser];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: { 
          findAll: jest.fn().mockResolvedValue(mockUsers),
          findOne: jest.fn().mockResolvedValue(mockUser), // Typage du mock
        }},
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(mockUsers.map(user => new UserEntity(user)));
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should return the current user profile', async () => {
      const result = await controller.findOne('user1');

      expect(result).toEqual(new UserEntity(mockUser));
      expect(service.findOne).toHaveBeenCalledWith('user1');
    });
  });

  describe('findOne', () => {
    it('should return an existing user', async () => {
      const result = await controller.findOne('user1');

      expect(result).toEqual(new UserEntity(mockUser));
      expect(service.findOne).toHaveBeenCalledWith('user1');
    });

  });
});
