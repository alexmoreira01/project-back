import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { DatabaseModule } from '../database/database.module';
import { PrismaApiTokenRepository } from '../database/repositories/prisma-api-token.repository';

// Use Cases
import { CreateAuthToken } from '../../application/use-cases/auth/create-auth-token.use-case';
import { GetApiTokenByToken } from '../../application/use-cases/auth/get-api-token-by-token.use-case';
import { GetTokenAuth } from '../../application/use-cases/auth/get-token-auth.use-case';

// Guards
import { ApiTokenGuard } from './jwt-auth.guard';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: '8b6c-fef4-4d7d-b8ab-74kl-3729',
      signOptions: { expiresIn: '365d' },
    }),
  ],
  providers: [
    PrismaApiTokenRepository,
    
    CreateAuthToken,
    GetApiTokenByToken,
    GetTokenAuth,
    
    ApiTokenGuard,
  ],
  exports: [
    CreateAuthToken,
    GetApiTokenByToken,
    GetTokenAuth,
    ApiTokenGuard,
  ],
})
export class AuthModule {}