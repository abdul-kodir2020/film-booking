import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '@prisma/client';
import { IsDate, IsInt, IsUUID } from 'class-validator';

export class ReservationEntity implements Reservation{
    constructor(partial: Partial<ReservationEntity>){
        Object.assign(this, partial)
    }


    @IsUUID()
    @ApiProperty()
    id: string;

    @IsInt()
    @ApiProperty()
    movieId: number;

    @IsDate()
    @ApiProperty()
    date: Date;

    @IsUUID()
    @ApiProperty()
    userId: string;

    createdAt: Date;
    updatedAt: Date;
}
