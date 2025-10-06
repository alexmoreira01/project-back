import { Injectable } from '@nestjs/common';
import { PrismaNoteRepository } from '../../../infra/database/repositories/prisma-note.repository';

interface GetAllNotesRequest {
  filters?: any;
}

interface GetAllNotesResponse {
  success: boolean;
  message: string;
  notes: any[];
}

@Injectable()
export class GetAllNotesUseCase {
  constructor(private noteRepository: PrismaNoteRepository) {}

  async execute(request: GetAllNotesRequest): Promise<GetAllNotesResponse> {
    try {
      const { filters = {} } = request;

      const notes = await this.noteRepository.findWithFilters(filters);

      return {
        success: true,
        message: 'Notes retrieved successfully',
        notes: notes.map(note => ({
          id: note.id,
          title: note.title,
          description: note.description,
          category: note.category,
          status: note.status,
          priority: note.priority,
          createdById: note.createdById,
          assignedToId: note.assignedToId,
          teamId: note.teamId,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
          dueDate: note.dueDate,
        })),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to retrieve notes',
        notes: [],
      };
    }
  }
}