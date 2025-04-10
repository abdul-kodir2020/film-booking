import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

// Mock du service Prisma
const mockPrismaService = {
  reservation: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ReservationService', () => {
  let service: ReservationService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a reservation if no conflict exists', async () => {
      const createReservationDto = { movieId: 1, date: '2025-04-10T12:00:00Z' };
      const userId = 'user1';

      // Simuler aucune réservation existante
      mockPrismaService.reservation.findMany.mockResolvedValue([]);

      mockPrismaService.reservation.create.mockResolvedValue({
        id: 'reservation1',
        ...createReservationDto,
        userId,
      });

      const result = await service.create(createReservationDto, userId);

      expect(result).toEqual({
        id: 'reservation1',
        ...createReservationDto,
        userId,
      });
      expect(mockPrismaService.reservation.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });

    it('should throw an error if there is a conflict within 2 hours of another reservation', async () => {
      const createReservationDto = { movieId: 1, date: '2025-04-10T12:00:00Z' };
      const userId = 'user1';

      // Simuler une réservation existante à 1 heure avant la nouvelle
      const existingReservations = [
        {
          id: 'reservation1',
          movieId: '1',
          date: '2025-04-10T11:00:00Z',
          userId,
        },
      ];
      mockPrismaService.reservation.findMany.mockResolvedValue(existingReservations);

      await expect(service.create(createReservationDto, userId)).rejects.toThrowError(
        new BadRequestException('Vous avez déjà réservé un film dans les 2 heures avant ou après une autre réservation.')
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of reservations for a given user', async () => {
      const userId = 'user1';
      const reservations = [
        { id: 'reservation1', movieId: '1', date: '2025-04-10T12:00:00Z', userId },
      ];

      mockPrismaService.reservation.findMany.mockResolvedValue(reservations);

      const result = await service.findAll(userId);

      expect(result).toEqual(reservations);
      expect(mockPrismaService.reservation.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });

  describe('remove', () => {
    it('should delete a reservation if it exists and belongs to the user', async () => {
      const reservationId = 'reservation1';
      const userId = 'user1';
  
      // Simuler une réservation existante appartenant à l'utilisateur
      mockPrismaService.reservation.findUnique.mockResolvedValue({
        id: reservationId,
        movieId: '1',
        date: '2025-04-10T12:00:00Z',
        userId,
      });
  
      mockPrismaService.reservation.delete.mockResolvedValue({
        id: reservationId,
        movieId: '1',
        date: '2025-04-10T12:00:00Z',
        userId,
      });
  
      const result = await service.remove(reservationId, userId);
  
      expect(result).toEqual({
        id: reservationId,
        movieId: '1',
        date: '2025-04-10T12:00:00Z',
        userId,
      });
      expect(mockPrismaService.reservation.findUnique).toHaveBeenCalledWith({
        where: { id: reservationId, userId },
      });
      expect(mockPrismaService.reservation.delete).toHaveBeenCalledWith({
        where: { id: reservationId },
      });
    });
  
    // it('should throw an error if the reservation does not exist or does not belong to the user', async () => {
    //   const reservationId = 'reservation1';
    //   const userId = 'user1';
  
    //   // Simuler l'absence de réservation ou réservation appartenant à un autre utilisateur
    //   mockPrismaService.reservation.findUnique.mockResolvedValue(null);  // Aucun résultat trouvé
  
    //   // Vérification du rejet de l'exception
    //   await expect(service.remove(reservationId, userId)).rejects.toThrow(
    //     new BadRequestException("Cette reservation n'existe pas ou ne vous appartient pas !")
    //   );
    // });
  });
  
  
});
