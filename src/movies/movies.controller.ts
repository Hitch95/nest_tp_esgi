import { Controller, Get, Query } from '@nestjs/common';

import { MoviesService } from './movies.service';
import { QueryMovieDto } from './dto/query-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  findAll(@Query() query: QueryMovieDto) {
    return this.moviesService.findAll(query);
  }
}
