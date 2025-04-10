import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { getMockRequest } from '../utils/mock-request';
import { ReservationEntity } from './entities/reservation.entity';
import { BadRequestException } from '@nestjs/common';

describe('ReservationController', () => {
  let reservationController: ReservationController;
  let reservationService: ReservationService;

  const mockReservationService = {
    create: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = { id: 'user1' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: mockReservationService,
        },
      ],
    }).compile();

    reservationController = module.get<ReservationController>(ReservationController);
    reservationService = module.get<ReservationService>(ReservationService);
  });

  describe('create', () => {
    it('should successfully create a reservation', async () => {
      const createReservationDto = { movieId: 1, date: '2025-04-10T12:00:00Z' };
      const mockReservation = {
        id: 'reservation1',
        movieId: 1,
        date: new Date('2025-04-10T12:00:00Z'),
        userId: 'user1',
      };
      mockReservationService.create.mockResolvedValue(mockReservation);

      const request = getMockRequest(mockUser);

      const result = await reservationController.create(createReservationDto, request);

      expect(result).toEqual({
        reservation: new ReservationEntity(mockReservation),
        message: 'Reservation réussie',
      });
      expect(mockReservationService.create).toHaveBeenCalledWith(createReservationDto, mockUser.id);
    });

    it('should throw error if reservation creation fails', async () => {
      const createReservationDto = { movieId: 1, date: '2025-04-10T12:00:00Z' };
      mockReservationService.create.mockRejectedValue(new BadRequestException('Failed to create reservation'));

      const request = getMockRequest(mockUser);

      await expect(reservationController.create(createReservationDto, request))
        .rejects
        .toThrowError(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all reservations for the user', async () => {
      const mockReservations = [
        { id: 'reservation1', movieId: 1, date: new Date('2025-04-10T12:00:00Z'), userId: 'user1' },
        { id: 'reservation2', movieId: 1, date: new Date('2025-04-11T12:00:00Z'), userId: 'user1' },
      ];
      mockReservationService.findAll.mockResolvedValue(mockReservations);

      const request = getMockRequest(mockUser);

      const result = await reservationController.findAll(request);

      expect(result).toEqual(mockReservations.map(reservation => new ReservationEntity(reservation)));
      expect(mockReservationService.findAll).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw error if findAll fails', async () => {
      mockReservationService.findAll.mockRejectedValue(new BadRequestException('Failed to fetch reservations'));

      const request = getMockRequest(mockUser);

      await expect(reservationController.findAll(request))
        .rejects
        .toThrowError(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should successfully remove a reservation', async () => {
      const reservationId = 'reservation1';
      const mockReservation = { id: reservationId, movieId: '1', date: '2025-04-10T12:00:00Z', userId: 'user1' };
      mockReservationService.remove.mockResolvedValue(mockReservation);

      const request = getMockRequest(mockUser);

      const result = await reservationController.remove(reservationId, request);

      expect(result).toEqual({
        id_reservation: reservationId,
        message: 'Annulation de la réservation réussie',
      });
      expect(mockReservationService.remove).toHaveBeenCalledWith(reservationId, mockUser.id);
    });

    it('should throw error if reservation remove fails', async () => {
      const reservationId = 'reservation1';
      mockReservationService.remove.mockRejectedValue(new BadRequestException('Reservation not found'));

      const request = getMockRequest(mockUser);

      await expect(reservationController.remove(reservationId, request))
        .rejects
        .toThrowError(BadRequestException);
    });
  });
});
