import { Module } from '@nestjs/common';
import { NotesSystemModule } from './infra/notes-system.module';

@Module({
  imports: [NotesSystemModule],
})
export class AppModule {}