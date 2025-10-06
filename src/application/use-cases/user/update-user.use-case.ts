import { Injectable } from '@nestjs/common';
import { PrismaUserRepository } from '../../../infra/database/repositories/prisma-user.repository';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

export interface UpdateUserRequest {
  userId: number;
  name?: string;
  email?: string;
  password?: string;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  user?: User;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(private userRepository: PrismaUserRepository) {}

  async execute(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    try {
      const { userId, name, email, password } = request;

      const existingUser = await this.userRepository.findById(userId);
      if (!existingUser) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      if (email && email !== existingUser.email) {
        const emailExists = await this.userRepository.findByEmail(email);
        if (emailExists) {
          return {
            success: false,
            message: 'Email already exists',
          };
        }
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      
      if (password !== undefined) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await this.userRepository.update(userId, updateData);

      return {
        success: true,
        message: 'User updated successfully',
        user: updatedUser,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update user',
      };
    }
  }
}