import { Injectable } from '@nestjs/common';
import { PrismaNoteRepository } from '../../../infra/database/repositories/prisma-note.repository';

interface AssignNoteRequest {
  noteId: number;
  assignedToId: number;
}

interface AssignNoteResponse {
  success: boolean;
  message: string;
  note?: any;
}

@Injectable()
export class AssignNoteUseCase {
  constructor(private noteRepository: PrismaNoteRepository) {}

  async execute(request: AssignNoteRequest): Promise<AssignNoteResponse> {
    try {
      const { noteId, assignedToId } = request;

      const existingNote = await this.noteRepository.findById(noteId);
      if (!existingNote) {
        return {
          success: false,
          message: 'Note not found',
        };
      }

      const assignedNote = await this.noteRepository.assignToUser(noteId, assignedToId);

      return {
        success: true,
        message: 'Note assigned successfully',
        note: {
          id: assignedNote.id,
          title: assignedNote.title,
          description: assignedNote.description,
          category: assignedNote.category,
          status: assignedNote.status,
          priority: assignedNote.priority,
          createdById: assignedNote.createdById,
          assignedToId: assignedNote.assignedToId,
          teamId: assignedNote.teamId,
          createdAt: assignedNote.createdAt,
          updatedAt: assignedNote.updatedAt,
          dueDate: assignedNote.dueDate,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to assign note',
      };
    }
  }
}