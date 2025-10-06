import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service';
import { User, UserType } from '../../../application/entities/user.entity';

@Injectable()
export class PrismaUserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: number): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userData) return null;

    return new User(
      {
        email: userData.email,
        name: userData.name,
        password: userData.password,
        userType: userData.userType as UserType,
        teamId: userData.teamId,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
      },
      userData.id.toString(),
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!userData) return null;

    return new User(
      {
        email: userData.email,
        name: userData.name,
        password: userData.password,
        userType: userData.userType as UserType,
        teamId: userData.teamId,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
      },
      userData.id.toString(),
    );
  }

  async findByTeamId(teamId: number): Promise<User[]> {
    const usersData = await this.prisma.user.findMany({
      where: { teamId },
    });

    return usersData.map(
      userData =>
        new User(
          {
            email: userData.email,
            name: userData.name,
            password: userData.password,
            userType: userData.userType as UserType,
            teamId: userData.teamId,
            createdAt: userData.created_at,
            updatedAt: userData.updated_at,
          },
          userData.id.toString(),
        ),
    );
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const userData = await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
        userType: user.userType,
        teamId: user.teamId,
      },
    });

    return new User(
      {
        email: userData.email,
        name: userData.name,
        password: userData.password,
        userType: userData.userType as UserType,
        teamId: userData.teamId,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
      },
      userData.id.toString(),
    );
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const userData = await this.prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        userType: data.userType,
        teamId: data.teamId,
      },
    });

    return new User(
      {
        email: userData.email,
        name: userData.name,
        password: userData.password,
        userType: userData.userType as UserType,
        teamId: userData.teamId,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
      },
      userData.id.toString(),
    );
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async joinTeam(userId: number, teamId: number): Promise<User> {
    const userData = await this.prisma.user.update({
      where: { id: userId },
      data: { teamId },
    });

    return new User(
      {
        email: userData.email,
        name: userData.name,
        password: userData.password,
        userType: userData.userType as UserType,
        teamId: userData.teamId,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
      },
      userData.id.toString(),
    );
  }

  async leaveTeam(userId: number): Promise<User> {
    const userData = await this.prisma.user.update({
      where: { id: userId },
      data: { teamId: null },
    });

    return new User(
      {
        email: userData.email,
        name: userData.name,
        password: userData.password,
        userType: userData.userType as UserType,
        teamId: userData.teamId,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
      },
      userData.id.toString(),
    );
  }
}