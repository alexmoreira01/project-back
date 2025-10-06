import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaApiTokenRepository } from '../../../infra/database/repositories/prisma-api-token.repository';

interface GetApiTokenByTokenRequest {
  token: string;
}

interface GetApiTokenResponse {
  id: string;
  token: string;
  userId: string;
  name: string | null;
  expiresAt: Date | null;
  revoked: boolean;
}

@Injectable()
export class GetApiTokenByToken {
  constructor(private apiTokenRepository: PrismaApiTokenRepository) {}

  async execute(
    request: GetApiTokenByTokenRequest,
  ): Promise<GetApiTokenResponse | null> {
    const { token } = request;

    const result = await this.apiTokenRepository.findByToken(token);

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      token: result.token,
      userId: result.userId,
      name: result.name,
      expiresAt: result.expiresAt,
      revoked: result.revoked,
    };
  }
}