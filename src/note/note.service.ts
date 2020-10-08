import { Injectable } from '@nestjs/common';
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
    return await this.noteRepository.findOne({ id });
  }

  async update(id: string, data: Partial<NoteDTO>) {
    await this.noteRepository.update({ id }, data);
    return await this.noteRepository.findOne({ id });
  }

  async destory(id: string) {
    await this.noteRepository.delete({ id });
    return { deleted: true };
  }
}
