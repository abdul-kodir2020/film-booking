import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        headers: {
          'Authorization': `Bearer ${process.env.API_JETON}`,
          'Content-Type': 'application/json',
        },
      }),
    }),
  ],
})
export class MoviesModule {}
