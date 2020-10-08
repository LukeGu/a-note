import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { NoteDTO } from './note.dto';
import { NoteService } from './note.service';

@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Get()
  showAllNotes() {
    return this.noteService.showAll();
  }

  @Get(':id')
  showNote(@Param('id') id: string) {
    return this.noteService.read(id);
  }

  @Post()
  createNewNote(@Body() data: NoteDTO) {
    return this.noteService.create(data);
  }

  @Put(':id')
  updateNote(@Param('id') id: string, @Body() data: Partial<NoteDTO>) {
    return this.noteService.update(id, data);
  }

  @Delete(':id')
  deleteNote(@Param('id') id: string) {
    return this.noteService.destory(id);
  }
}
