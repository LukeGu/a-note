import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NoteEntity } from './note.entity';
import { NoteDTO } from './note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity)
    private noteRepository: Repository<NoteEntity>,
  ) {}

  async showAll() {
    return await this.noteRepository.find();
  }

  async create(data: NoteDTO) {
    this.noteRepository.create(data);
    return await this.noteRepository.save(data);
  }

  async read(id: string) {
    const note = await this.noteRepository.findOne({ id });
    if (!note) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return note;
  }

  async update(id: string, data: Partial<NoteDTO>) {
    let note = await this.noteRepository.findOne({ id });
    if (!note) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.noteRepository.update({ id }, data);
    note = await this.noteRepository.findOne({ id });
    return note;
  }

  async destory(id: string) {
    const note = await this.noteRepository.findOne({ id });
    if (!note) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.noteRepository.delete({ id });
    return note;
  }
}
