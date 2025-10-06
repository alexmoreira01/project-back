import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

import { PrismaUserRepository } from './database/repositories/prisma-user.repository';
import { PrismaNoteRepository } from './database/repositories/prisma-note.repository';

import { CreateUserUseCase } from './../application/use-cases/user/create-user.use-case';
import { UpdateUserUseCase } from 'src/application/use-cases/user/update-user.use-case';
import { AuthenticateUserUseCase } from './../application/use-cases/user/authenticate-user.use-case';
import { GetUserUseCase } from './../application/use-cases/user/get-user.use-case';

import { CreateNoteUseCase } from './../application/use-cases/notes/create-note.use-case';
import { GetUserNotesUseCase } from './../application/use-cases/notes/get-user-notes.use-case';
import { GetAllNotesUseCase } from './../application/use-cases/notes/get-all-notes.use-case';
import { GetNoteUseCase } from './../application/use-cases/notes/get-note.use-case';
import { UpdateNoteUseCase } from './../application/use-cases/notes/update-note.use-case';
import { DeleteNoteUseCase } from './../application/use-cases/notes/delete-note.use-case';
import { AssignNoteUseCase } from './../application/use-cases/notes/assign-note.use-case';
import { UnassignNoteUseCase } from './../application/use-cases/notes/unassign-note.use-case';

import { UserController } from './controllers/user.controller';
import { NotesController } from './controllers/notes.controller';
import { GetUserStatsUseCase } from 'src/application/use-cases/notes/get-user-stats.use-case';

@Module({
  imports: [
    DatabaseModule, 
    AuthModule,
    JwtModule.register({
      secret: '8b6c-fef4-4d7d-b8ab-74kl-3729',
      signOptions: { expiresIn: '365d' },
    }),
  ],
  controllers: [
    UserController,
    NotesController,
  ],
  providers: [
    PrismaUserRepository,
    PrismaNoteRepository,

    CreateUserUseCase,
    UpdateUserUseCase,
    AuthenticateUserUseCase,
    GetUserUseCase,

    CreateNoteUseCase,
    GetUserNotesUseCase,
    GetAllNotesUseCase,
    GetNoteUseCase,
    GetUserStatsUseCase,
    UpdateNoteUseCase,
    DeleteNoteUseCase,
    AssignNoteUseCase,
    UnassignNoteUseCase,
  ],
})
export class NotesSystemModule {}