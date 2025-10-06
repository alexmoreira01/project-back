import { Injectable } from '@nestjs/common';
import { PrismaNoteRepository } from '../../../infra/database/repositories/prisma-note.repository';

interface UnassignNoteRequest {
  noteId: number;
}

interface UnassignNoteResponse {
  success: boolean;
  message: string;
  note?: any;
}

@Injectable()
export class UnassignNoteUseCase {
  constructor(private noteRepository: PrismaNoteRepository) {}

  async execute(request: UnassignNoteRequest): Promise<UnassignNoteResponse> {
    try {
      const { noteId } = request;

      // Verificar se a note existe
      const existingNote = await this.noteRepository.findById(noteId);
      if (!existingNote) {
        return {
          success: false,
          message: 'Note not found',
        };
      }

      const unassignedNote = await this.noteRepository.unassign(noteId);

      return {
        success: true,
        message: 'Note unassigned successfully',
        note: {
          id: unassignedNote.id,
          title: unassignedNote.title,
          description: unassignedNote.description,
          category: unassignedNote.category,
          status: unassignedNote.status,
          priority: unassignedNote.priority,
          createdById: unassignedNote.createdById,
          assignedToId: unassignedNote.assignedToId,
          teamId: unassignedNote.teamId,
          createdAt: unassignedNote.createdAt,
          updatedAt: unassignedNote.updatedAt,
          dueDate: unassignedNote.dueDate,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to unassign note',
      };
    }
  }
}