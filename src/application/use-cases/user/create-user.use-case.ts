import { Injectable } from '@nestjs/common';
import { PrismaUserRepository } from '../../../infra/database/repositories/prisma-user.repository';
import { User, UserType } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  userType?: UserType;
}

export interface CreateUserResponse {
  user: User;
}

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: PrismaUserRepository) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    const { email, name, password, userType = UserType.USER } = request;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      name,
      password: hashedPassword,
      userType,
    });

    const createdUser = await this.userRepository.create(user);

    return { user: createdUser };
  }
}