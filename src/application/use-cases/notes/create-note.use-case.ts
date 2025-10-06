import { Injectable } from '@nestjs/common';
import { PrismaNoteRepository } from '../../../infra/database/repositories/prisma-note.repository';
import { PrismaUserRepository } from '../../../infra/database/repositories/prisma-user.repository';
import { Note, NoteStatus, Priority, Category } from '../../entities/note.entity';

export interface CreateNoteRequest {
  title: string;
  description?: string;
  category?: Category;
  priority?: Priority;
  createdById: number;
  assignedToId?: number;
  teamId?: number;
  dueDate?: Date;
}

export interface CreateNoteResponse {
  note: Note | null;
  success: boolean;
  message: string;
}

@Injectable()
export class CreateNoteUseCase {
  constructor(
    private noteRepository: PrismaNoteRepository,
    private userRepository: PrismaUserRepository,
  ) {}

  async execute(request: CreateNoteRequest): Promise<CreateNoteResponse> {
    const {
      title,
      description,
      category,
      priority = Priority.MEDIUM,
      createdById,
      assignedToId,
      teamId,
      dueDate,
    } = request;

    if (category && !Object.values(Category).includes(category)) {
      return {
        note: null,
        success: false,
        message: 'Invalid category. Must be "note" or "task"',
      };
    }

    const creator = await this.userRepository.findById(createdById);
    if (!creator) {
      return {
        note: null,
        success: false,
        message: 'Creator user not found',
      };
    }

    if (assignedToId) {
      const assignedUser = await this.userRepository.findById(assignedToId);
      if (!assignedUser) {
        return {
          note: null,
          success: false,
          message: 'Assigned user not found',
        };
      }
    }

    if (teamId) {
      console.log("TeamID>: ", teamId);
    }

    const note = new Note({
      title,
      createdById,
      status: NoteStatus.PENDING,
      priority,
      description,
      category: category || null,
      assignedToId,
      teamId,
      dueDate,
    });

    const createdNote = await this.noteRepository.create(note);

    return {
      note: createdNote,
      success: true,
      message: 'Note created successfully',
    };
  }
}