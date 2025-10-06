import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, UseGuards, Put } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/user/create-user.use-case';
import { AuthenticateUserUseCase } from '../../application/use-cases/user/authenticate-user.use-case';
import { GetUserUseCase } from '../../application/use-cases/user/get-user.use-case';
import { CreateUserDto, AuthenticateUserDto, JoinTeamDto, UpdateUserDto } from '../dtos/user/user.dto';
import { CreateAuthToken } from '../../application/use-cases/auth/create-auth-token.use-case';
import { ApiTokenGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UpdateUserUseCase } from 'src/application/use-cases/user/update-user.use-case';

@Controller('users')
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private authenticateUserUseCase: AuthenticateUserUseCase,
    private getUserUseCase: GetUserUseCase,
    private createAuthToken: CreateAuthToken,
  ) {}

  @UseGuards(ApiTokenGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: any) {
    try {
      const result = await this.getUserUseCase.execute({
        userId: parseInt(id),
      });

      if (!result.user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: result.user,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.createUserUseCase.execute(createUserDto);

      return {
        success: true,
        message: 'User created successfully',
        data: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          userType: result.user.userType,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(ApiTokenGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() currentUser: any) {
    try {
      console.log("updateUserDto:", updateUserDto);
      console.log("Current User:", currentUser);

      const userId = parseInt(id);
      
      // Converter currentUser.id para number para comparar corretamente
      const currentUserId = parseInt(currentUser.userId);
      
      console.log("userId:", userId, "currentUserId:", currentUserId);
      
      // Verificar se o usuário pode atualizar (apenas próprios dados ou admin)
      if (currentUserId !== userId && currentUser.userType !== 'ADMIN') {
        throw new HttpException('Forbidden: You can only update your own profile', HttpStatus.FORBIDDEN);
      }

      console.log("Passou na validação");

      const result = await this.updateUserUseCase.execute({
        userId,
        name: updateUserDto.name,
        email: updateUserDto.email,
        password: updateUserDto.password,
      });

      if (!result.success || !result.user) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      console.log("Update result::", result);

      return {
        success: true,
        message: result.message,
        data: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          userType: result.user.userType,
          teamId: result.user.teamId,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('authenticate')
  async authenticate(@Body() authenticateUserDto: AuthenticateUserDto) {
    try {
      const result = await this.authenticateUserUseCase.execute(authenticateUserDto);

      if (!result.isValid || !result.user) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      // Gerar API token
      const authResult = await this.createAuthToken.execute({
        userId: result.user.id,
        name: `Token for ${result.user.email}`,
        expiresAt: null, // Token sem expiração
      });

      return {
        success: true,
        message: 'Authentication successful',
        token: authResult.token,
        expiresAt: authResult.expiresAt,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          userType: result.user.userType,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Authentication failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}