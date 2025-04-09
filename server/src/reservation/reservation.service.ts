import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService){}
  
  async create(createReservationDto: CreateReservationDto, userId: string) {
    const { movieId, date } = createReservationDto;

    const reservationDate = new Date(date);

    const existingReservations = await this.prisma.reservation.findMany({
      where: {
        userId,
      },
    });

    const isConflict = existingReservations.some((reservation) => {
      const existingReservationDate = new Date(reservation.date);

      const twoHoursBefore = new Date(existingReservationDate.getTime() - 2 * 60 * 60 * 1000);
      const twoHoursAfter = new Date(existingReservationDate.getTime() + 2 * 60 * 60 * 1000);
      
      return reservationDate >= twoHoursBefore && reservationDate <= twoHoursAfter;
    });

    if (isConflict) {
      throw new BadRequestException('Vous avez déjà réservé un film dans les 2 heures avant ou après une autre réservation.');
    }

    return await this.prisma.reservation.create({
      data: {
        movieId,
        date: reservationDate,
        userId,
      },
    });
  }

  findAll(id: string) {
    return this.prisma.reservation.findMany({where: {userId: id}})
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} reservation`;
  // }

  // update(id: number, updateReservationDto: UpdateReservationDto) {
  //   return `This action updates a #${id} reservation`;
  // }

  remove(id: string, userId: string) {
    const reservation = this.prisma.reservation.findUnique({where: {id: id, userId: userId}})
    if(!reservation) throw new BadRequestException("Cette reservation n'existe pas ou ne vous appartient pas !")
    
    return this.prisma.reservation.delete({where: {id: id}})
  }
}
