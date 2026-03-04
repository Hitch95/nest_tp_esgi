import { IsOptional, IsString, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

import { MOVIE_STATUSES, type MovieStatus } from 'interfaces/movie.interface';

export class QueryMovieDto {
  @IsOptional()
  @Type(() => Number) // transforme la string "1" du query param en nombre 1
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  @IsIn(MOVIE_STATUSES)
  status?: MovieStatus;
}
