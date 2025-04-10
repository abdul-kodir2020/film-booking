import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '@prisma/client';
import { IsDate, IsInt, IsString, IsUUID } from 'class-validator';

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

    @IsString()
    @ApiProperty()
    movieName: string;

    @IsDate()
    @ApiProperty()
    date: Date;

    @IsUUID()
    @ApiProperty()
    userId: string;

    createdAt: Date;
    updatedAt: Date;
}
