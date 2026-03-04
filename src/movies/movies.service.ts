import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { StorageService } from '../storage/storage.service';
import { type Movie } from 'interfaces/movie.interface';
import { QueryMovieDto } from './dto/query-movie.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly storage: StorageService) {}

  findAll(query: QueryMovieDto) {
    let movies = this.storage.read<Movie[]>('movies.json');

    if (query.genre) {
      movies = movies.filter((movie) =>
        movie.genres.some((genre) =>
          genre.toLowerCase().includes(query.genre!.toLowerCase()),
        ),
      );
    }

    if (query.status) {
      movies = movies.filter((movie) => movie.status === query.status);
    }

    if (query.language) {
      movies = movies.filter((movie) => movie.language === query.language);
    }

    if (query.year) {
      movies = movies.filter((movie) => movie.year === query.year);
    }

    if (query.sortBy) {
      const order = query.sortOrder === 'asc' ? 1 : -1;
      const sortField = query.sortBy;
      movies.sort((a, b) => (a[sortField] - b[sortField]) * order);
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

  search(q: string): Movie[] {
    const movies = this.storage.read<Movie[]>('movies.json');
    const term = q.toLowerCase();
    return movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(term) ||
        movie.director.toLowerCase().includes(term) ||
        movie.synopsis.toLowerCase().includes(term),
    );
  }

  findOne(id: number): Movie {
    const movie = this.storage
      .read<Movie[]>('movies.json')
      .find((movie) => movie.id === id);
    if (!movie) throw new NotFoundException(`Movie with id ${id} not found`); // → 404
    return movie;
  }

  exists(id: number): boolean {
    const movies = this.storage.read<Movie[]>('movies.json');
    return movies.some((m) => m.id === id);
  }

  create(dto: CreateMovieDto): Movie {
    const movies = this.storage.read<Movie[]>('movies.json');

    if (
      movies.some(
        (movie) => movie.title.toLowerCase() === dto.title.toLowerCase(),
      )
    ) {
      throw new ConflictException(
        `A movie titled "${dto.title}" already exists`,
      ); // → 409
    }

    const nextId = Math.max(...movies.map((movie) => movie.id), 0) + 1;
    const newMovie: Movie = { id: nextId, ...dto };

    this.storage.write('movies.json', [...movies, newMovie]);
    return newMovie;
  }

  replace(id: number, dto: CreateMovieDto): Movie {
    const movies = this.storage.read<Movie[]>('movies.json');
    const index = movies.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    const conflict = movies.find(
      (m) => m.title.toLowerCase() === dto.title.toLowerCase() && m.id !== id,
    );
    if (conflict) {
      throw new ConflictException(
        `A movie titled "${dto.title}" already exists`,
      );
    }

    const updated: Movie = { id, ...dto };
    movies[index] = updated;
    this.storage.write('movies.json', movies);
    return updated;
  }

  update(id: number, dto: UpdateMovieDto): Movie {
    const movies = this.storage.read<Movie[]>('movies.json');
    const index = movies.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    if (dto.title) {
      const conflict = movies.find(
        (m) =>
          m.title.toLowerCase() === dto.title!.toLowerCase() && m.id !== id,
      );
      if (conflict) {
        throw new ConflictException(
          `A movie titled "${dto.title}" already exists`,
        );
      }
    }

    const updated: Movie = { ...movies[index], ...dto };
    movies[index] = updated;
    this.storage.write('movies.json', movies);
    return updated;
  }

  remove(id: number): void {
    const movies = this.storage.read<Movie[]>('movies.json');
    const index = movies.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    } else if (movies[index].status === 'upcoming') {
      throw new ConflictException(`Cannot delete a upcoming movie`);
    }
    movies.splice(index, 1);
    this.storage.write('movies.json', movies);
  }
}
