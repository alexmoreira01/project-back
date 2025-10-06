import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ApiToken } from '../../entities/api-token.entity';
import { PrismaApiTokenRepository } from '../../../infra/database/repositories/prisma-api-token.repository';

interface CreateApiTokenRequest {
  userId: string;
  name: string;
  expiresAt: Date | null;
}

interface CreateApiTokenResponse {
  token: string;
  expiresAt: Date;
}

@Injectable()
export class CreateAuthToken {
  constructor(
    private apiTokenRepository: PrismaApiTokenRepository,
    private jwtService: JwtService,
  ) {}

  async execute(
    request: CreateApiTokenRequest,
  ): Promise<CreateApiTokenResponse> {
    const { userId, name, expiresAt } = request;

    if (!userId || !name) {
      throw new Error('userId and name are required');
    }

    const tokenValid = await this.apiTokenRepository.findByUserId(userId);
    if (tokenValid) {
      tokenValid.revoke();
      await this.apiTokenRepository.save(tokenValid);
    }

    let token: string;
    let existingToken: ApiToken | null;

    const apiTokenExpiresAt = expiresAt
      ? new Date(expiresAt)
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    const expiresInData = expiresAt
      ? Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
      : '365d';

    const payload = {
      sub: userId,
      type: 'api',
    };

    do {
      token = this.jwtService.sign(payload, {
        secret: '8b6c-fef4-4d7d-b8ab-74kl-3729',
        expiresIn: expiresInData,
      });
      existingToken = await this.apiTokenRepository.findByToken(token);
    } while (existingToken);

    const apiToken = new ApiToken({
      token,
      userId,
      name,
      expiresAt: apiTokenExpiresAt,
    });

    await this.apiTokenRepository.create(apiToken);

    return {
      token: apiToken.token,
      expiresAt: apiTokenExpiresAt,
    };
  }
}