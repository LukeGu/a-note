import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { CommentDTO } from './comment.dto';
import { CommentService } from './comment.service';
import { User } from 'src/user/user.decorator';

@Controller('api/comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get(':id')
  showCommentsById(@Param('id') id: string) {
    return this.commentService.read(id);
  }

  @Get('note/:id')
  showCommentsByNoteId(@Param('id') noteId: string) {
    return this.commentService.showByNote(noteId);
  }

  @Get('user/:id')
  showCommentsByUserId(@Param('id') userId: string) {
    return this.commentService.showByUser(userId);
  }

  @Post('note/:id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createComment(
    @Param('id') noteId: string,
    @User('id') userId: string,
    @Body() data: CommentDTO,
  ) {
    return this.commentService.create(noteId, userId, data);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destoryComment(@Param('id') id: string, @User('id') userId: string) {
    return this.commentService.destory(id, userId);
  }
}
