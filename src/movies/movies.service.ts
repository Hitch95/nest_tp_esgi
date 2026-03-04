import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { type Movie } from 'interfaces/movie.interface';
import { QueryMovieDto } from './dto/query-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly storage: StorageService) {}

  findAll(query: QueryMovieDto) {
    let movies = this.storage.read<Movie[]>('movies.json');

    if (query.genre) {
      movies = movies.filter((movie) =>
        movie.genres.some((g) =>
          g.toLowerCase().includes(query.genre!.toLowerCase()),
        ),
      );
    }

    if (query.status) {
      movies = movies.filter((movie) => movie.status === query.status);
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const start = (page - 1) * limit;

    return {
      data: movies.slice(start, start + limit),
      total: movies.length,
      page,
      limit,
    };
  }

  findOne(id: number): Movie {
    const movie = this.storage
      .read<Movie[]>('movies.json')
      .find((m) => m.id === id);
    if (!movie) throw new NotFoundException(`Movie with id ${id} not found`); // → 404
    return movie;
  }
}
