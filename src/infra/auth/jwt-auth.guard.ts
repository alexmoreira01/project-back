import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { GetApiTokenByToken } from '../../application/use-cases/auth/get-api-token-by-token.use-case';

@Injectable()
export class ApiTokenGuard implements CanActivate {
  constructor(
    private getApiTokenByToken: GetApiTokenByToken,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Token não encontrado.');
    }

    try {
      const decodedToken = (await this.jwtService.verify(token, {
        secret: '8b6c-fef4-4d7d-b8ab-74kl-3729',
      })) as { sub: string; type?: string };

      if (!decodedToken || decodedToken.type !== 'api') {
        throw new UnauthorizedException('Token inválido para API.');
      }

      const apiToken = await this.getApiTokenByToken.execute({ token });

      if (
        !apiToken ||
        apiToken.revoked ||
        (apiToken.expiresAt && apiToken.expiresAt < new Date())
      ) {
        throw new UnauthorizedException('Token expirado ou inválido.');
      }

      request.user = { userId: apiToken.userId };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Falha na autenticação do token.');
    }
  }
}