import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateReservationDto {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    movieId: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    movieName: string;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    date: string;
}