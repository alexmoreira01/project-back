import { Injectable } from '@nestjs/common';
import { PrismaNoteRepository } from '../../../infra/database/repositories/prisma-note.repository';

interface GetNoteRequest {
  noteId: number;
}

interface GetNoteResponse {
  success: boolean;
  message: string;
  note?: any;
}

@Injectable()
export class GetNoteUseCase {
  constructor(private noteRepository: PrismaNoteRepository) {}

  async execute(request: GetNoteRequest): Promise<GetNoteResponse> {
    try {
      const { noteId } = request;

      const note = await this.noteRepository.findById(noteId);

      if (!note) {
        return {
          success: false,
          message: 'Note not found',
        };
      }

      return {
        success: true,
        message: 'Note retrieved successfully',
        note: {
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
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to retrieve note',
      };
    }
  }
}