import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { BadRequestException } from '@nestjs/common';
import { PaginatedMoviesResponse } from './entities/movie.entity';

// Simuler le service MoviesService
const mockMoviesService = {
  findAll: jest.fn(),
};

describe('MoviesController', () => {
  let moviesController: MoviesController;
  let moviesService: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    moviesController = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  describe('findAll', () => {
    it('should return a paginated list of movies', async () => {
      const mockResponse: PaginatedMoviesResponse = {
        page: 1,
        results: [{
          popularity: 5, title: 'Fast & Furious',
          id: 0,
          adult: false,
          backdrop_path: '',
          genre_ids: [],
          original_language: '',
          original_title: '',
          overview: '',
          poster_path: '',
          release_date: '',
          video: false,
          vote_average: 0,
          vote_count: 0
        }],
        total_pages: 2,
        total_results: 100,
      };
      mockMoviesService.findAll.mockResolvedValue(mockResponse);

      const result = await moviesController.findAll(1, 'Fast & Furious', 'desc');

      expect(result).toEqual(mockResponse);
      expect(mockMoviesService.findAll).toHaveBeenCalledWith(1, 'Fast & Furious', 'desc');
    });

    it('should use default values for search_keyword and sortBy', async () => {
      const mockResponse: PaginatedMoviesResponse = {
        page: 1,
        results: [{
          popularity: 5, title: 'Fast & Furious',
          id: 0,
          adult: false,
          backdrop_path: '',
          genre_ids: [],
          original_language: '',
          original_title: '',
          overview: '',
          poster_path: '',
          release_date: '',
          video: false,
          vote_average: 0,
          vote_count: 0
        }],
        total_pages: 2,
        total_results: 100,
      };
      mockMoviesService.findAll.mockResolvedValue(mockResponse);

      const result = await moviesController.findAll(1, '', 'desc');

      expect(result).toEqual(mockResponse);
      expect(mockMoviesService.findAll).toHaveBeenCalledWith(1, '', 'desc');
    });

    it('should throw BadRequestException when sortBy is invalid', async () => {
      try {
        await moviesController.findAll(1, 'Fast & Furious', 'invalid' as 'asc' | 'desc');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.response.message).toBe('Le champ sortBy n\'accepte que asc et desc');
      }
    });
  });
});
