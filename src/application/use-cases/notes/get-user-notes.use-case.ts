import { Injectable } from '@nestjs/common';
import { PrismaNoteRepository } from '../../../infra/database/repositories/prisma-note.repository';
import { Note, NoteStatus, Priority, Category } from '../../entities/note.entity';

export interface GetUserNotesRequest {
  userId: number;
  filters?: {
    title?: string;
    status?: NoteStatus;
    priority?: Priority;
    category?: Category;
    assignedToId?: number;
    teamId?: number;
    createdById?: number;
    startDate?: Date;
    endDate?: Date;
  };
}

export interface GetUserNotesResponse {
  success: boolean;
  message: string;
  notes?: Note[];
}

@Injectable()
export class GetUserNotesUseCase {
  constructor(private noteRepository: PrismaNoteRepository) {}

  async execute(request: GetUserNotesRequest): Promise<GetUserNotesResponse> {
    try {
      const { userId, filters = {} } = request;

      // Combinar filtros do usuário com filtros adicionais
      const combinedFilters = {
        ...filters,
        userId,
      };

      const notes = await this.noteRepository.findWithFilters(combinedFilters);

      return {
        success: true,
        message: 'User notes retrieved successfully',
        notes,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to retrieve user notes',
      };
    }
  }
}