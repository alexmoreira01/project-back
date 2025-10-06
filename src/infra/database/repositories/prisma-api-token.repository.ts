import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service';
import { ApiToken } from '../../../application/entities/api-token.entity';

@Injectable()
export class PrismaApiTokenRepository {
  constructor(private prisma: PrismaService) {}

  async findByToken(token: string): Promise<ApiToken | null> {
    const tokenData = await this.prisma.apiToken.findUnique({
      where: { token },
    });

    if (!tokenData) return null;

    return new ApiToken(
      {
        token: tokenData.token,
        userId: tokenData.userId.toString(),
        name: tokenData.name,
        expiresAt: tokenData.expiresAt,
        revoked: tokenData.revoked,
        createdAt: tokenData.created_at,
        updatedAt: tokenData.updated_at,
      },
      tokenData.id.toString(),
    );
  }

  async findByUserId(userId: string): Promise<ApiToken | null> {
    const tokenData = await this.prisma.apiToken.findFirst({
      where: { 
        userId: parseInt(userId),
        revoked: false,
      },
    });

    if (!tokenData) return null;

    return new ApiToken(
      {
        token: tokenData.token,
        userId: tokenData.userId.toString(),
        name: tokenData.name,
        expiresAt: tokenData.expiresAt,
        revoked: tokenData.revoked,
        createdAt: tokenData.created_at,
        updatedAt: tokenData.updated_at,
      },
      tokenData.id.toString(),
    );
  }

  async create(apiToken: ApiToken): Promise<ApiToken> {
    const tokenData = await this.prisma.apiToken.create({
      data: {
        token: apiToken.token,
        userId: parseInt(apiToken.userId),
        name: apiToken.name,
        expiresAt: apiToken.expiresAt,
        revoked: apiToken.revoked,
      },
    });

    return new ApiToken(
      {
        token: tokenData.token,
        userId: tokenData.userId.toString(),
        name: tokenData.name,
        expiresAt: tokenData.expiresAt,
        revoked: tokenData.revoked,
        createdAt: tokenData.created_at,
        updatedAt: tokenData.updated_at,
      },
      tokenData.id.toString(),
    );
  }

  async save(apiToken: ApiToken): Promise<ApiToken> {
    const tokenData = await this.prisma.apiToken.update({
      where: { id: parseInt(apiToken.id) },
      data: {
        revoked: apiToken.revoked,
        updated_at: new Date(),
      },
    });

    return new ApiToken(
      {
        token: tokenData.token,
        userId: tokenData.userId.toString(),
        name: tokenData.name,
        expiresAt: tokenData.expiresAt,
        revoked: tokenData.revoked,
        createdAt: tokenData.created_at,
        updatedAt: tokenData.updated_at,
      },
      tokenData.id.toString(),
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.apiToken.delete({
      where: { id: parseInt(id) },
    });
  }
}