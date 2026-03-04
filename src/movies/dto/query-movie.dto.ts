import { IsOptional, IsString, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

import {
  MOVIE_STATUSES,
  MOVIE_LANGUAGES,
  type MovieStatus,
  type MovieLanguage,
} from 'interfaces/movie.interface';
import { ApiProperty } from '@nestjs/swagger';

export class QueryMovieDto {
  @ApiProperty({
    description: 'Numéro de page pour la pagination',
    required: false,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Nombre de films par page',
    required: false,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiProperty({
    description: 'Genre du film',
    required: false,
    example: 'Action',
  })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty({
    description: 'Statut du film',
    required: false,
    enum: MOVIE_STATUSES,
  })
  @IsOptional()
  @IsString()
  @IsIn(MOVIE_STATUSES)
  status?: MovieStatus;

  @ApiProperty({
    description: 'Langue du film',
    required: false,
    enum: MOVIE_LANGUAGES,
  })
  @IsOptional()
  @IsString()
  @IsIn(MOVIE_LANGUAGES)
  language?: MovieLanguage;

  @ApiProperty({
    description: 'Année de sortie',
    required: false,
    example: 2008,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  year?: number;

  @ApiProperty({
    description: 'Tri par rating ou année',
    required: false,
    enum: ['rating', 'year'],
  })
  @IsOptional()
  @IsIn(['rating', 'year'])
  sortBy?: 'rating' | 'year';

  @ApiProperty({
    description: 'Ordre de tri (ascendant ou descendant)',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
