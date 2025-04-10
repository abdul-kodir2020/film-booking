import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('MoviesService', () => {
  let moviesService: MoviesService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    moviesService = module.get<MoviesService>(MoviesService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('findAll', () => {
    it('should return sorted movies when valid sortBy is provided', async () => {
      const mockResponse = {
        data: {
          page: 1,
          results: [
            { popularity: 2 },
            { popularity: 5 },
            { popularity: 3 },
          ],
          total_pages: 1,
          total_results: 3,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      // jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockResponse));
      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockResponse as AxiosResponse))
      

      const result = await moviesService.findAll(1, '', 'asc');
      
      expect(result.results[0].popularity).toBe(2);
      expect(result.results[1].popularity).toBe(3);
      expect(result.results[2].popularity).toBe(5);
    });

    it('should return sorted movies in descending order by default', async () => {
      const mockResponse = {
        data: {
          page: 1,
          results: [
            { popularity: 2 },
            { popularity: 5 },
            { popularity: 3 },
          ],
          total_pages: 1,
          total_results: 3,
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockResponse as AxiosResponse));

      const result = await moviesService.findAll(1, '', 'desc');
      
      expect(result.results[0].popularity).toBe(5);
      expect(result.results[1].popularity).toBe(3);
      expect(result.results[2].popularity).toBe(2);
    });

    it('should throw BadRequestException if an invalid sortBy value is provided', async () => {
      const invalidSortBy = 'invalid';

      try {
        await moviesService.findAll(1, '', invalidSortBy as 'asc' | 'desc');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Le champ sortBy n\'accepte que asc et desc');
      }
    });

    it('should return search results when search_keyword is provided', async () => {
      const mockResponse = {
        data: {
          page: 1,
          results: [{ popularity: 5 }, { popularity: 3 }],
          total_pages: 1,
          total_results: 2,
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockResponse as AxiosResponse));

      const result = await moviesService.findAll(1, 'action', 'desc');

      expect(result.results.length).toBe(2);
      expect(result.results[0].popularity).toBe(5);
    });

    it('should call the correct URL with the search_keyword', async () => {
      const mockResponse = {
        data: {
          page: 1,
          results: [{ popularity: 3 }],
          total_pages: 1,
          total_results: 1,
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockResponse as AxiosResponse));

      await moviesService.findAll(1, 'action', 'desc');

      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/search/movie?query=action&include_adult=false&language=en-US&page=1'
      );
    });

    it('should return results for the discover endpoint when no search_keyword is provided', async () => {
      const mockResponse = {
        data: {
          page: 1,
          results: [{ popularity: 3 }],
          total_pages: 1,
          total_results: 1,
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockResponse as AxiosResponse));

      const result = await moviesService.findAll(1);

      expect(result.results.length).toBe(1);
      expect(result.results[0].popularity).toBe(3);
    });
  });
});
