import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteEntity } from 'src/note/note.entity';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CommentDTO } from './comment.dto';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(NoteEntity)
    private noteRepository: Repository<NoteEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(comment: CommentEntity) {
    const resObj: any = comment;
    if (comment.author) {
      resObj.author = comment.author.toResponseObject(false);
    }
    return resObj;
  }

  async showByNote(id: string) {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: ['comments', 'comments.author', 'comments.note'],
    });
    return note.comments.map(comment => this.toResponseObject(comment));
  }

  async showByUser(id: string) {
    const comments = await this.commentRepository.find({
      where: { author: { id } },
      relations: ['author'],
    });
    return comments.map(comment => this.toResponseObject(comment));
  }

  async read(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'note'],
    });
    return this.toResponseObject(comment);
  }

  async create(noteId: string, userId: string, data: CommentDTO) {
    const note = await this.noteRepository.findOne({
      where: { id: noteId },
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const comment = await this.commentRepository.create({
      ...data,
      note,
      author: user,
    });
    await this.commentRepository.save(comment);
    return this.toResponseObject(comment);
  }

  async destory(id: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'note'],
    });
    if (comment.author.id !== userId) {
      throw new HttpException(
        'You do not own this comment',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.commentRepository.remove(comment);
    return this.toResponseObject(comment);
  }
}
