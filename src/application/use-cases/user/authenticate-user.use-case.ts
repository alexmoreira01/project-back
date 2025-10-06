import { Injectable } from '@nestjs/common';
import { PrismaUserRepository } from '../../../infra/database/repositories/prisma-user.repository';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

export interface AuthenticateUserRequest {
  email: string;
  password: string;
}

export interface AuthenticateUserResponse {
  user: User | null;
  isValid: boolean;
}

@Injectable()
export class AuthenticateUserUseCase {
  constructor(private userRepository: PrismaUserRepository) {}

  async execute(request: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const { email, password } = request;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return { user: null, isValid: false };
    }

    // Verificar senha
    const isValid = await bcrypt.compare(password, user.password);

    return { user: isValid ? user : null, isValid };
  }
}