import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { NoteDTO } from './note.dto';
import { NoteService } from './note.service';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Controller('note')
export class NoteController {
  private logger = new Logger('NoteController');
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
  @UsePipes(new ValidationPipe())
  createNewNote(@Body() data: NoteDTO) {
    this.logger.log(JSON.stringify(data));
    return this.noteService.create(data);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateNote(@Param('id') id: string, @Body() data: Partial<NoteDTO>) {
    this.logger.log(JSON.stringify(data));
    return this.noteService.update(id, data);
  }

  @Delete(':id')
  deleteNote(@Param('id') id: string) {
    return this.noteService.destory(id);
  }
}
