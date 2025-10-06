import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service';
import { Category, Note, NoteStatus, Priority } from '../../../application/entities/note.entity';

export interface FindNotesFilters {
  userId?: number;
  teamId?: number;
  status?: NoteStatus;
  category?: Category;
  priority?: Priority;
  assignedToId?: number;
  createdById?: number;
  title?: string;
  startDate?: Date;        
  endDate?: Date;          
}

@Injectable()
export class PrismaNoteRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: number): Promise<Note | null> {
    const noteData = await this.prisma.note.findUnique({
      where: { id },
    });

    if (!noteData) return null;

    return new Note({
      id: noteData.id.toString(),
      title: noteData.title,
      createdById: noteData.createdById,
      status: noteData.status as NoteStatus,
      priority: noteData.priority as Priority,
      description: noteData.description,
      category: noteData.category as Category,
      assignedToId: noteData.assignedToId,
      teamId: noteData.teamId,
      dueDate: noteData.dueDate,
      createdAt: noteData.created_at,
      updatedAt: noteData.updated_at,
    });
  }

  async findByUserId(userId: number): Promise<Note[]> {
    const notesData = await this.prisma.note.findMany({
      where: {
        OR: [
          { createdById: userId },
          { assignedToId: userId },
        ],
      },
      orderBy: { created_at: 'desc' },
    });

    return this.mapNotesToEntities(notesData);
  }

  async findByTeamId(teamId: number): Promise<Note[]> {
    const notesData = await this.prisma.note.findMany({
      where: { teamId },
      orderBy: { created_at: 'desc' },
    });

    return this.mapNotesToEntities(notesData);
  }

  async findWithFilters(filters: FindNotesFilters): Promise<Note[]> {
    const where: any = {};

    if (filters.userId) {
      where.OR = [
        { createdById: filters.userId },
        { assignedToId: filters.userId },
      ];
    }
    if (filters.teamId) where.teamId = filters.teamId;
    if (filters.status) where.status = filters.status;
    if (filters.category) where.category = filters.category;
    if (filters.priority) where.priority = filters.priority;
    if (filters.assignedToId) where.assignedToId = filters.assignedToId;
    if (filters.createdById) where.createdById = filters.createdById;
    
    if (filters.title) {
      where.title = {
        contains: filters.title
      };
    }
    
    // Filtro por intervalo de datas
    if (filters.startDate || filters.endDate) {
      where.created_at = {};
      if (filters.startDate) {
        where.created_at.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.created_at.lte = filters.endDate;
      }
    }

    const notesData = await this.prisma.note.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    return this.mapNotesToEntities(notesData);
  }

  async create(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    const noteData = await this.prisma.note.create({
      data: {
        title: note.title,
        createdById: note.createdById,
        status: (note.status as any) || 'PENDING',
        priority: (note.priority as any) || 'MEDIUM',
        description: note.description || null,
        category: (note.category as any) || null,
        assignedToId: note.assignedToId || null,
        teamId: note.teamId || null,
        dueDate: note.dueDate || null,
      },
    });

    return new Note({
      id: noteData.id.toString(),
      title: noteData.title,
      createdById: noteData.createdById,
      status: noteData.status as NoteStatus,
      priority: noteData.priority as Priority,
      description: noteData.description,
      category: noteData.category as Category,
      assignedToId: noteData.assignedToId,
      teamId: noteData.teamId,
      dueDate: noteData.dueDate,
      createdAt: noteData.created_at,
      updatedAt: noteData.updated_at,
    });
  }

  async update(id: number, data: Partial<Note>): Promise<Note> {
    try {
      // Criar objeto sem validação de tipos
      const updateData = {} as any;
      
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.assignedToId !== undefined) updateData.assignedToId = data.assignedToId;
      if (data.teamId !== undefined) updateData.teamId = data.teamId;
      if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.priority !== undefined) updateData.priority = data.priority;
      if (data.category !== undefined) updateData.category = data.category;

      // Usar query raw se necessário
      const noteData = await this.prisma.note.update({
        where: { id },
        data: updateData,
      });

      return new Note({
        id: noteData.id.toString(),
        title: noteData.title,
        createdById: noteData.createdById,
        status: noteData.status as NoteStatus,
        priority: noteData.priority as Priority,
        description: noteData.description,
        category: noteData.category as Category,
        assignedToId: noteData.assignedToId,
        teamId: noteData.teamId,
        dueDate: noteData.dueDate,
        createdAt: noteData.created_at,
        updatedAt: noteData.updated_at,
      });

    } catch (error) {
      console.error("Error in repository update:", error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.note.delete({
      where: { id },
    });
  }

  async updateStatus(id: number, status: NoteStatus): Promise<Note> {
    const noteData = await this.prisma.note.update({
      where: { id },
      data: { status: status as any },
    });

    return new Note({
      id: noteData.id.toString(),
      title: noteData.title,
      createdById: noteData.createdById,
      status: noteData.status as NoteStatus,
      priority: noteData.priority as Priority,
      description: noteData.description,
      category: noteData.category as Category,
      assignedToId: noteData.assignedToId,
      teamId: noteData.teamId,
      dueDate: noteData.dueDate,
      createdAt: noteData.created_at,
      updatedAt: noteData.updated_at,
    });
  }

  async assignToUser(noteId: number, userId: number): Promise<Note> {
    const noteData = await this.prisma.note.update({
      where: { id: noteId },
      data: { assignedToId: userId },
    });

    return new Note({
      id: noteData.id.toString(),
      title: noteData.title,
      createdById: noteData.createdById,
      status: noteData.status as NoteStatus,
      priority: noteData.priority as Priority,
      description: noteData.description,
      category: noteData.category as Category,
      assignedToId: noteData.assignedToId,
      teamId: noteData.teamId,
      dueDate: noteData.dueDate,
      createdAt: noteData.created_at,
      updatedAt: noteData.updated_at,
    });
  }

  async unassign(noteId: number): Promise<Note> {
    const noteData = await this.prisma.note.update({
      where: { id: noteId },
      data: { assignedToId: null },
    });

    return new Note({
      id: noteData.id.toString(),
      title: noteData.title,
      createdById: noteData.createdById,
      status: noteData.status as NoteStatus,
      priority: noteData.priority as Priority,
      description: noteData.description,
      category: noteData.category as Category,
      assignedToId: noteData.assignedToId,
      teamId: noteData.teamId,
      dueDate: noteData.dueDate,
      createdAt: noteData.created_at,
      updatedAt: noteData.updated_at,
    });
  }

  async countByStatus(status: NoteStatus, userId?: number): Promise<number> {
    const where: any = { status: status as any };
    
    if (userId) {
      where.OR = [
        { createdById: userId },
        { assignedToId: userId },
      ];
    }

    return await this.prisma.note.count({ where });
  }

  private mapNotesToEntities(notesData: any[]): Note[] {
    return notesData.map(noteData =>
      new Note({
        id: noteData.id.toString(),
        title: noteData.title,
        createdById: noteData.createdById,
        status: noteData.status as NoteStatus,
        priority: noteData.priority as Priority,
        description: noteData.description,
        category: noteData.category as Category,
        assignedToId: noteData.assignedToId,
        teamId: noteData.teamId,
        dueDate: noteData.dueDate,
        createdAt: noteData.created_at,
        updatedAt: noteData.updated_at,
      })
    );
  }
}