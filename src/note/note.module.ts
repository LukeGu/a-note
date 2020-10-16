import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NoteEntity } from './note.entity';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { UserEntity } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NoteEntity, UserEntity])],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
