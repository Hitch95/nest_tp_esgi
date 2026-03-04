import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsInt,
  IsIn,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

import {
  MOVIE_STATUSES,
  MOVIE_LANGUAGES,
  type MovieStatus,
  type MovieLanguage,
} from 'interfaces/movie.interface';

export class CreateMovieDto {
  @ApiProperty({ example: 'The Dark Knight', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Christopher Nolan', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  director: string;

  @ApiProperty({ example: ['Christian Bale', 'Heath Ledger'], type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  cast: string[];

  @ApiProperty({ example: ['Action', 'Drama'], type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  genres: string[];

  @ApiProperty({ example: 2008, minimum: 1900, maximum: 2100 })
  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;

  @ApiProperty({ example: 152, description: 'Duration in minutes' })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 9.0, minimum: 0, maximum: 10 })
  @Min(0)
  @Max(10)
  rating: number;

  @ApiProperty({ enum: MOVIE_LANGUAGES, example: 'en' })
  @IsString()
  @IsIn(MOVIE_LANGUAGES)
  language: MovieLanguage;

  @ApiProperty({
    example: 'When the menace known as the Joker wreaks havoc...',
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  synopsis: string;

  @ApiProperty({ enum: MOVIE_STATUSES, example: 'released' })
  @IsString()
  @IsIn(MOVIE_STATUSES)
  status: MovieStatus;
}
