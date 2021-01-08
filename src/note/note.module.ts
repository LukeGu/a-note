import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NoteEntity } from './note.entity';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { UserEntity } from 'src/user/user.entity';
import { NoteResolver } from './note.resolver';
import { CommentEntity } from 'src/comment/comment.entity';
import { CommentService } from 'src/comment/comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([NoteEntity, UserEntity, CommentEntity])],
  controllers: [NoteController],
  providers: [NoteService, NoteResolver, CommentService],
})
export class NoteModule {}
