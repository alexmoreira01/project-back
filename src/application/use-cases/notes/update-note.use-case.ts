import { Injectable } from '@nestjs/common';
import { PrismaNoteRepository } from '../../../infra/database/repositories/prisma-note.repository';
import { Category, NoteStatus, Priority } from '../../entities/note.entity';

interface UpdateNoteRequest {
  noteId: number;
  title?: string;
  description?: string;
  category?: Category;
  priority?: Priority;
  status?: NoteStatus;
  dueDate?: Date | null;
}

interface UpdateNoteResponse {
  success: boolean;
  message: string;
  note?: any;
}

@Injectable()
export class UpdateNoteUseCase {
  constructor(private noteRepository: PrismaNoteRepository) {}

  async execute(request: UpdateNoteRequest): Promise<UpdateNoteResponse> {
    try {
      const { noteId, title, description, category, priority, status, dueDate } = request;

      const existingNote = await this.noteRepository.findById(noteId);
      if (!existingNote) {
        return {
          note: null,
          success: false,
          message: 'Note not found',
        };
      }

      // Preparar dados para atualização
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (category !== undefined) updateData.category = category;
      if (priority !== undefined) updateData.priority = priority;
      if (status !== undefined) updateData.status = status;
      if (dueDate !== undefined) updateData.dueDate = dueDate;

      const updatedNote = await this.noteRepository.update(noteId, updateData);

      return {
        success: true,
        message: 'Note updated successfully',
        note: {
          id: updatedNote.id,
          title: updatedNote.title,
          description: updatedNote.description,
          category: updatedNote.category,
          status: updatedNote.status,
          priority: updatedNote.priority,
          createdById: updatedNote.createdById,
          assignedToId: updatedNote.assignedToId,
          teamId: updatedNote.teamId,
          createdAt: updatedNote.createdAt,
          updatedAt: updatedNote.updatedAt,
          dueDate: updatedNote.dueDate,
        },
      };
    } catch (error) {
      console.error("Error in UpdateNoteUseCase:", error);
      return {
        success: false,
        message: error.message || 'Failed to update note',
      };
    }
  }
}