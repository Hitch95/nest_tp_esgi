import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Request,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiHeader,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User } from 'interfaces/user.interface';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('Auth')
@ApiSecurity('api-key')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Créer un compte',
    description: 'Enregistre un nouvel utilisateur et retourne sa clef API.',
  })
  @ApiResponse({
    status: 201,
    description: 'Compte créé — retourne { apiKey }',
  })
  @ApiResponse({ status: 400, description: 'Corps de requête invalide' })
  @ApiResponse({ status: 409, description: 'Email déjà enregistré' })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password);
  }

  @Get('me')
  @ApiOperation({
    summary: "Profil de l'utilisateur courant",
    description:
      'Retourne les informations du compte associé à la clef API fournie.',
  })
  @ApiHeader({
    name: 'X-API-Key',
    description: "Clef API de l'utilisateur",
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Profil utilisateur (sans mot de passe)',
  })
  @ApiResponse({ status: 401, description: 'Clef API absente' })
  @ApiResponse({ status: 403, description: 'Clef API invalide' })
  getMe(@Request() req: ExpressRequest) {
    const user: User = (req as any).user;
    return this.authService.getMe(user.apiKey);
  }

  @Post('regenerate-key')
  @ApiOperation({
    summary: 'Régénérer la clef API',
    description: "Invalide l'ancienne clef et en génère une nouvelle.",
  })
  @ApiResponse({ status: 200, description: 'Nouvelle clef API retournée' })
  @ApiResponse({ status: 401, description: 'Clef API absente' })
  regenerateKey(@Request() req: ExpressRequest) {
    return this.authService.regenerateKey((req as any).user.apiKey);
  }

  @Delete('account')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Supprimer le compte',
    description: 'Supprime définitivement le compte et invalide la clef API.',
  })
  @ApiResponse({ status: 204, description: 'Compte supprimé' })
  @ApiResponse({ status: 401, description: 'Clef API absente' })
  deleteAccount(@Request() req: ExpressRequest) {
    this.authService.deleteAccount((req as any).user.apiKey);
  }
}
