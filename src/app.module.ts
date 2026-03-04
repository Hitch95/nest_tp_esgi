import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './storage/storage.module';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { AdminGuard } from './common/guards/admin.guard';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    StorageModule,
    MoviesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard }, // exécuté en 1er
    { provide: APP_GUARD, useClass: ApiKeyGuard }, // exécuté en 2nd
    { provide: APP_GUARD, useClass: AdminGuard }, // exécuté en 3ème
  ],
})
export class AppModule {}
