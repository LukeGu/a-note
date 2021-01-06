import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { NoteDTO } from './note.dto';
import { NoteService } from './note.service';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';

@Controller('api/note')
export class NoteController {
  private logger = new Logger('NoteController');
  constructor(private noteService: NoteService) {}

  private logData(options: any) {
    options.user && this.logger.log('USER' + JSON.stringify(options.user));
    options.data && this.logger.log('DATA' + JSON.stringify(options.data));
    options.id && this.logger.log('NOTE' + JSON.stringify(options.id));
  }

  @Get()
  showAllNotes() {
    return this.noteService.showAll();
  }

  @Get(':id')
  showNote(@Param('id') id: string) {
    return this.noteService.read(id);
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createNewNote(@User('id') userId: string, @Body() data: NoteDTO) {
    this.logData({ userId, data });
    return this.noteService.create(userId, data);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateNote(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() data: Partial<NoteDTO>,
  ) {
    this.logData({ id, userId, data });
    return this.noteService.update(id, userId, data);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  deleteNote(@Param('id') id: string, @User('id') userId: string) {
    this.logData({ id, userId });
    return this.noteService.destory(id, userId);
  }

  @Post(':id/like')
  @UseGuards(new AuthGuard())
  likesNote(@Param('id') id: string, @User('id') userId: string) {
    this.logData({ id, userId });
    return this.noteService.like(id, userId);
  }

  @Post(':id/dislike')
  @UseGuards(new AuthGuard())
  dislikesNote(@Param('id') id: string, @User('id') userId: string) {
    this.logData({ id, userId });
    return this.noteService.dislike(id, userId);
  }

  @Post(':id/bookmark')
  @UseGuards(new AuthGuard())
  bookmarkNote(@Param('id') id: string, @User('id') userId: string) {
    this.logData({ id, userId });
    return this.noteService.bookmark(id, userId);
  }

  @Delete(':id/bookmark')
  @UseGuards(new AuthGuard())
  unbookmarkNote(@Param('id') id: string, @User('id') userId: string) {
    this.logData({ id, userId });
    return this.noteService.unbookmark(id, userId);
  }
}
