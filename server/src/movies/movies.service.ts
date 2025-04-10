import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MoviesService {
    constructor(private readonly httpService: HttpService) {}

    async findAll(page: number = 1, search_keyword: String = "", sortBy: 'asc' | 'desc' = 'desc') {
        try {
            if(sortBy && sortBy !== 'asc' && sortBy !== 'desc') throw new BadRequestException('Le champ sortBy n\'accepte que asc et desc')
            const url = 
                search_keyword ? 
                `https://api.themoviedb.org/3/search/movie?query=${search_keyword}&include_adult=false&language=en-US&page=${page}`
                : 
                `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}${sortBy ? `&sort_by=popularity.${sortBy}` : ''}&with_release_type=2|3&release_date.gte=2024-01-01&release_date.lte=2025-12-31`
       
            const response = await firstValueFrom(
                this.httpService.get(url),
            );

            const data = response.data

            const sortedResults = sortBy === 'asc'
                    ? data.results.sort((a: { popularity: number }, b: { popularity: number }) => a.popularity - b.popularity)
                    : data.results.sort((a: { popularity: number }, b: { popularity: number }) => b.popularity - a.popularity);

            return {
                page: data.page,
                results: sortedResults,
                total_pages: data.total_pages,
                total_results: data.total_results
            }

        } catch (error) {
            throw new BadRequestException(error)
        } 
    }
    
}
