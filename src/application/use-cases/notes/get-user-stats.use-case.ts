import { Injectable } from '@nestjs/common';
import { PrismaNoteRepository } from '../../../infra/database/repositories/prisma-note.repository';
import { NoteStatus } from '../../entities/note.entity';

interface GetUserStatsRequest {
  userId: number;
}

export interface UserStats {
  PENDING: number;
  TODO: number;
  IN_PROGRESS: number;
  REVIEW: number;
  COMPLETED: number;
  CANCELLED: number;
  total: number;
}

interface GetUserStatsResponse {
  success: boolean;
  message: string;
  stats?: UserStats;
}

@Injectable()
export class GetUserStatsUseCase {
  constructor(private noteRepository: PrismaNoteRepository) {}

  async execute(request: GetUserStatsRequest): Promise<GetUserStatsResponse> {
    try {
      const { userId } = request;

      const PENDING = await this.noteRepository.countByStatus(NoteStatus.PENDING, userId);
      const TODO = await this.noteRepository.countByStatus(NoteStatus.TODO, userId);
      const IN_PROGRESS = await this.noteRepository.countByStatus(NoteStatus.IN_PROGRESS, userId);
      const REVIEW = await this.noteRepository.countByStatus(NoteStatus.REVIEW, userId);
      const COMPLETED = await this.noteRepository.countByStatus(NoteStatus.COMPLETED, userId);
      const CANCELLED = await this.noteRepository.countByStatus(NoteStatus.CANCELLED, userId);

      const total = PENDING + TODO + IN_PROGRESS + REVIEW + COMPLETED + CANCELLED;

      const stats: UserStats = {
        PENDING,
        TODO,
        IN_PROGRESS,
        REVIEW,
        COMPLETED,
        CANCELLED,
        total,
      };

      return {
        success: true,
        message: 'User stats retrieved successfully',
        stats,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to retrieve user stats',
      };
    }
  }
}