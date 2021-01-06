import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NoteEntity } from './note.entity';
import { UserEntity } from 'src/user/user.entity';
import { NoteDTO, NoteRO } from './note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity)
    private noteRepository: Repository<NoteEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(note: NoteEntity): NoteRO {
    const resObj: any = {
      ...note,
      author: note.author.toResponseObject(false),
    };
    if (resObj.likes) {
      resObj.likes = note.likes.length;
    }
    if (resObj.dislikes) {
      resObj.dislikes = note.dislikes.length;
    }
    return resObj;
  }

  private ensureOwnership(note: NoteEntity, userId: string) {
    if (note.author.id !== userId)
      throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED);
  }
  // ****** like/dislike handler ******
  private async vote(note: NoteEntity, user: UserEntity, action: string) {
    const opposite = action === 'likes' ? 'dislikes' : 'likes';
    if (
      note[action].filter(item => item.id === user.id).length > 0 ||
      note[opposite].filter(item => item.id === user.id).length > 0
    ) {
      note[action] = note[action].filter(item => item.id !== user.id);
      note[opposite] = note[opposite].filter(item => item.id !== user.id);
      await this.noteRepository.save(note);
    } else if (note[action].filter(item => item.id === user.id).length === 0) {
      note[action].push(user);
      await this.noteRepository.save(note);
    } else {
      throw new HttpException(
        'Unable to cast the vote',
        HttpStatus.BAD_REQUEST,
      );
    }
    return note;
  }
  // ****** note CRUD features ******
  async showAll(): Promise<NoteRO[]> {
    const notes = await this.noteRepository.find({
      relations: ['author', 'likes', 'dislikes'],
    });
    return notes.map(note => this.toResponseObject(note));
  }

  async create(userId: string, data: NoteDTO): Promise<NoteRO> {
    const user = await this.userRepository.findOne({ id: userId });
    this.noteRepository.create({
      ...data,
      author: user,
    });
    const note = await this.noteRepository.save({
      ...data,
      author: user,
    });
    return this.toResponseObject(note);
  }

  async read(id: string): Promise<NoteRO> {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: ['author', 'likes', 'dislikes'],
    });
    if (!note) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(note);
  }

  async update(
    id: string,
    userId: string,
    data: Partial<NoteDTO>,
  ): Promise<NoteRO> {
    let note = await this.noteRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!note) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(note, userId);
    await this.noteRepository.update({ id }, data);
    note = await this.noteRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    return this.toResponseObject(note);
  }

  async destory(id: string, userId: string) {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!note) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(note, userId);
    await this.noteRepository.delete({ id });
    return this.toResponseObject(note);
  }

  // ****** vote features ******
  async like(id: string, userId: string) {
    let note = await this.noteRepository.findOne({
      where: { id },
      relations: ['author', 'likes', 'dislikes'],
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    note = await this.vote(note, user, 'likes');
    return this.toResponseObject(note);
  }

  async dislike(id: string, userId: string) {
    let note = await this.noteRepository.findOne({
      where: { id },
      relations: ['author', 'likes', 'dislikes'],
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    note = await this.vote(note, user, 'dislikes');
    return this.toResponseObject(note);
  }

  // ****** bookmark features ******
  async bookmark(id: string, userId: string) {
    const note = await this.noteRepository.findOne({
      where: { id },
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });
    if (user.bookmarks.filter(bk => bk.id === note.id).length === 0) {
      user.bookmarks.push(note);
      await this.userRepository.save(user);
    } else {
      throw new HttpException(
        'Note already bookmarked.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.toResponseObject();
  }

  async unbookmark(id: string, userId: string) {
    const note = await this.noteRepository.findOne({
      where: { id },
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });
    if (user.bookmarks.filter(bk => bk.id === note.id).length > 0) {
      user.bookmarks = user.bookmarks.filter(bk => bk.id !== note.id);
      await this.userRepository.save(user);
    } else {
      throw new HttpException(
        'Cannot find the bookmark.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.toResponseObject();
  }
}
