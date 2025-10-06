import { Injectable } from '@nestjs/common';
import { PrismaNoteRepository } from '../../../infra/database/repositories/prisma-note.repository';

interface DeleteNoteRequest {
  noteId: number;
}

interface DeleteNoteResponse {
  success: boolean;
  message: string;
}

@Injectable()
export class DeleteNoteUseCase {
  constructor(private noteRepository: PrismaNoteRepository) {}

  async execute(request: DeleteNoteRequest): Promise<DeleteNoteResponse> {
    try {
      const { noteId } = request;

      const existingNote = await this.noteRepository.findById(noteId);
      if (!existingNote) {
        return {
          success: false,
          message: 'Note not found',
        };
      }

      await this.noteRepository.delete(noteId);

      return {
        success: true,
        message: 'Note deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete note',
      };
    }
  }
}