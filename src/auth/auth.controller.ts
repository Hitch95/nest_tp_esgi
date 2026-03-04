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

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User } from 'interfaces/user.interface';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register') // route publique — pas encore de guard global à cette étape
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password); // → 201 { apiKey }
  }

  @Get('me')
  getMe(@Request() req: ExpressRequest) {
    const user: User = (req as any).user; // peuplé par le guard (étape 5)
    return this.authService.getMe(user.apiKey); // → 200
  }

  @Post('regenerate-key')
  regenerateKey(@Request() req: ExpressRequest) {
    return this.authService.regenerateKey((req as any).user.apiKey); // → 200 { apiKey }
  }

  @Delete('account')
  @HttpCode(204)
  deleteAccount(@Request() req: ExpressRequest) {
    this.authService.deleteAccount((req as any).user.apiKey); // → 204
  }
}
