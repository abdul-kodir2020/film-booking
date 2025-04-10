import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { Request } from 'express';
import { ReservationEntity } from './entities/reservation.entity';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ 
    description: 'Reservation réussie', 
    schema: {
      type: 'object',
      properties: {
        reservation: { $ref: getSchemaPath(ReservationEntity) },
        message: { type: 'string' },
      },
    },
  })
  async create(@Body() createReservationDto: CreateReservationDto, @Req() req: Request) {
    const user = req.user as any;
    return {
      reservation: new ReservationEntity(await this.reservationService.create(createReservationDto, user.id)),
      message: 'Reservation réussie'
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ReservationEntity, isArray: true })
  async findAll(@Req() req: Request) {
    const user = req.user as any;
    const reservations = await this.reservationService.findAll(user.id)
    return reservations.map(reservation => new ReservationEntity(reservation));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ 
    description: 'Annulation de la réservation réussie', 
    schema: {
      type: 'object',
      properties: {
        id_reservation: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    const reservation = await this.reservationService.remove(id, user.id)
    return {
      id_reservation: reservation.id,
      message : 'Annulation de la réservation réussie'
    }
  }
}
