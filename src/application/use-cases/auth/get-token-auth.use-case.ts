import { Injectable } from '@nestjs/common';
import { PrismaApiTokenRepository } from '../../../infra/database/repositories/prisma-api-token.repository';

interface GetApiTokenByUserIdRequest {
  userId: string;
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
export class GetTokenAuth {
  constructor(private apiTokenRepository: PrismaApiTokenRepository) {}

  async execute(
    request: GetApiTokenByUserIdRequest,
  ): Promise<GetApiTokenResponse | null> {
    const { userId } = request;

    const result = await this.apiTokenRepository.findByUserId(userId);

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