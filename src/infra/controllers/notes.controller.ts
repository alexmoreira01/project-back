import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { CreateNoteUseCase } from '../../application/use-cases/notes/create-note.use-case';
import { GetUserNotesUseCase } from '../../application/use-cases/notes/get-user-notes.use-case';
import { GetAllNotesUseCase } from '../../application/use-cases/notes/get-all-notes.use-case';
import { GetNoteUseCase } from '../../application/use-cases/notes/get-note.use-case';
import { GetUserStatsUseCase } from '../../application/use-cases/notes/get-user-stats.use-case';
import { UpdateNoteUseCase } from '../../application/use-cases/notes/update-note.use-case';
import { DeleteNoteUseCase } from '../../application/use-cases/notes/delete-note.use-case';
import { AssignNoteUseCase } from '../../application/use-cases/notes/assign-note.use-case';
import { UnassignNoteUseCase } from '../../application/use-cases/notes/unassign-note.use-case';
import { CreateNoteDto, UpdateNoteDto, AssignNoteDto } from '../dtos/notes/notes.dto';
import { ApiTokenGuard } from '../auth/jwt-auth.guard';

export interface NotesQueryFilters {
  title?: string;          
  status?: string;
  priority?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  assignedToId?: string;   
  teamId?: string;         
  createdById?: string;
}

@Controller('notes')
@UseGuards(ApiTokenGuard)
export class NotesController {
  constructor(
    private readonly createNoteUseCase: CreateNoteUseCase,
    private readonly getUserNotesUseCase: GetUserNotesUseCase,
    private readonly getAllNotesUseCase: GetAllNotesUseCase,
    private readonly getNoteUseCase: GetNoteUseCase,
    private readonly getUserStatsUseCase: GetUserStatsUseCase,
    private readonly updateNoteUseCase: UpdateNoteUseCase,
    private readonly deleteNoteUseCase: DeleteNoteUseCase,
    private readonly assignNoteUseCase: AssignNoteUseCase,
    private readonly unassignNoteUseCase: UnassignNoteUseCase,
  ) { }

  @Get()
  async findAll(@Query() query: NotesQueryFilters) {
    try {

      const filters = {
        title: query.title,
        status: query.status as any,
        priority: query.priority as any,
        category: query.category as any,
        assignedToId: query.assignedToId ? parseInt(query.assignedToId) : undefined,
        teamId: query.teamId ? parseInt(query.teamId) : undefined,
        createdById: query.createdById ? parseInt(query.createdById) : undefined,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
      };

      const result = await this.getAllNotesUseCase.execute({ filters });

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        message: result.message,
        data: result.notes,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve notes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('my-notes/:userId')
  async getMyNotes(@Param('userId') userId: string, @Query() query: NotesQueryFilters) {
    try {
      const filters = {
        title: query.title,
        status: query.status as any,
        priority: query.priority as any,
        category: query.category as any,
        assignedToId: query.assignedToId ? parseInt(query.assignedToId) : undefined,
        teamId: query.teamId ? parseInt(query.teamId) : undefined,
        createdById: query.createdById ? parseInt(query.createdById) : undefined,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
      };

      // console.log("filters::", filters);
      
      const result = await this.getUserNotesUseCase.execute({
        userId: parseInt(userId),
        filters,
      });

      // console.log("result::", result);

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        message: result.message,
        data: result.notes,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve user notes',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('stats/:userId')
  async getUserStats(@Param('userId') userId: string) {
    try {
      const result = await this.getUserStatsUseCase.execute({ userId: parseInt(userId) });

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        message: result.message,
        data: result.stats,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve user stats',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.getNoteUseCase.execute({ noteId: parseInt(id) });

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: result.message,
        data: result.note,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve note',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto) {
    try {
      const result = await this.createNoteUseCase.execute({
        title: createNoteDto.title,
        description: createNoteDto.description,
        category: createNoteDto.category,
        priority: createNoteDto.priority,
        createdById: createNoteDto.createdById,
        assignedToId: createNoteDto.assignedToId,
        teamId: createNoteDto.teamId,
        dueDate: createNoteDto.dueDate ? new Date(createNoteDto.dueDate) : undefined,
      });

      if (!result.success || !result.note) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        message: result.message,
        data: result.note,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create note',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    try {
      const result = await this.updateNoteUseCase.execute({
        noteId: parseInt(id),
        title: updateNoteDto.title,
        description: updateNoteDto.description,
        category: updateNoteDto.category,
        priority: updateNoteDto.priority,
        status: updateNoteDto.status,
        dueDate: updateNoteDto.dueDate ? new Date(updateNoteDto.dueDate) : undefined,
      });

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        message: result.message,
        data: result.note,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update note',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.deleteNoteUseCase.execute({ noteId: parseInt(id) });

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete note',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id/assign')
  async assignToUser(@Param('id') id: string, @Body() assignDto: AssignNoteDto) {
    try {
      const result = await this.assignNoteUseCase.execute({
        noteId: parseInt(id),
        assignedToId: assignDto.assignedToId,
      });

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        message: result.message,
        data: result.note,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to assign note',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/unassign')
  async unassign(@Param('id') id: string) {
    try {
      const result = await this.unassignNoteUseCase.execute({ noteId: parseInt(id) });

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        message: result.message,
        data: result.note,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to unassign note',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}