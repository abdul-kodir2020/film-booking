import { ApiProperty } from '@nestjs/swagger';
export class Movie {
    id: number;
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string; 
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export class PaginatedMoviesResponse {
    @ApiProperty()
    page: number;
  
    @ApiProperty({ type: [Movie] })
    results: Movie[];
  
    @ApiProperty()
    total_pages: number;
  
    @ApiProperty()
    total_results: number;
}