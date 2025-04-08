import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MoviesService {
    constructor(private readonly httpService: HttpService) {}

    async findAll(page: number = 1, search_keyword: String = "") {
        try {
            const url = 
                search_keyword ? 
                `https://api.themoviedb.org/3/search/movie?query=${search_keyword}&include_adult=false&language=en-US&page=${page}`
                : 
                `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_release_type=2|3&release_date.gte=2024-01-01&release_date.lte=2025-12-31`
       
            const response = await firstValueFrom(
                this.httpService.get(url),
            );

            return response.data;

        } catch (error) {
            console.log(error)
            throw new BadRequestException(error)
        } 
    }
    
}
