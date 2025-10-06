import { IsString, IsOptional, IsEnum, IsNumber, IsDate, MinLength, MaxLength, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { Category, NoteStatus, Priority } from '../../../application/entities/note.entity';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(NoteStatus)
  status?: NoteStatus;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @IsNumber()
  assignedToId?: number;

  @IsNumber()
  createdById: number;

  @IsOptional()
  @IsNumber()
  teamId?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsEnum(NoteStatus)
  status?: NoteStatus;

  @IsOptional()
  @IsNumber()
  assignedToId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;
}

export class AssignNoteDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  assignedToId: number;
}