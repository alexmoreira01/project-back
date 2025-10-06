import { Injectable } from '@nestjs/common';
import { PrismaUserRepository } from '../../../infra/database/repositories/prisma-user.repository';
import { User } from '../../entities/user.entity';

export interface GetUserRequest {
  userId: number;
}

export interface GetUserResponse {
  user: User | null;
}

@Injectable()
export class GetUserUseCase {
  constructor(private userRepository: PrismaUserRepository) {}

  async execute(request: GetUserRequest): Promise<GetUserResponse> {
    const { userId } = request;

    const user = await this.userRepository.findById(userId);

    return { user };
  }
}