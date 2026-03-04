import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiSecurity,
  ApiParam,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';
import { AdminOnly } from 'src/common/decorator/admin.decorator';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('Films')
@ApiSecurity('api-key')
@Controller('films')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Public()
  @ApiOperation({ summary: 'Lister tous les films' })
  @ApiResponse({ status: 200, description: 'Liste des films' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'genre', required: false, type: String, example: 'Action' })
  @ApiQuery({ name: 'language', required: false, type: String, example: 'fr' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['released', 'upcoming', 'canceled'],
  })
  @ApiQuery({ name: 'year', required: false, type: Number, example: 2008 })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['rating', 'year'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @Get()
  findAll(@Query() query: QueryMovieDto) {
    return this.moviesService.findAll(query);
  }

  @Public()
  @ApiOperation({
    summary: 'Recherche full-text',
    description: 'Recherche sur titre, réalisateur et synopsis.',
  })
  @ApiQuery({ name: 'q', required: true, type: String, example: 'inception' })
  @ApiResponse({ status: 200, description: 'Résultats de recherche' })
  @ApiResponse({ status: 400, description: 'Paramètre q absent ou vide' })
  @Get('search')
  search(@Query('q') q: string) {
    if (!q || q.trim().length === 0) {
      throw new BadRequestException(
        'Query param "q" is required and cannot be empty',
      );
    }
    return this.moviesService.search(q.trim());
  }

  @Public()
  @ApiOperation({ summary: "Détail d'un film par id" })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Film trouvé' })
  @ApiResponse({ status: 404, description: 'Film introuvable' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  // ─── Écriture (admin uniquement) ─────────────────────────────────────────

  @ApiOperation({ summary: '[Admin] Créer un film' })
  @ApiResponse({ status: 201, description: 'Film créé' })
  @ApiResponse({
    status: 403,
    description: 'Accès réservé aux administrateurs',
  })
  @ApiResponse({ status: 409, description: 'Titre déjà existant' })
  @AdminOnly()
  @Post()
  @HttpCode(201)
  create(@Body() body: CreateMovieDto) {
    return this.moviesService.create(body);
  }
}
