import { Controller, DefaultValuePipe, Get, Param, ParseBoolPipe, ParseIntPipe, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { HttpService } from '@nestjs/axios';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { PaginatedMoviesResponse } from './entities/movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('')
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'search_keyword', required: false, type: String, example: "Fast & furious" })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['asc', 'desc'], example: 'asc' })
  @ApiOkResponse({ type: PaginatedMoviesResponse })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('search_keyword', new DefaultValuePipe("")) search_keyword: String,
    @Query('sortBy', new DefaultValuePipe("desc")) sortBy: "asc" | "desc",
  ) {
    return this.moviesService.findAll(page, search_keyword, sortBy)
  }
}
