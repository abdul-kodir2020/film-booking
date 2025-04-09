import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    movieId: number;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    date: string;
}