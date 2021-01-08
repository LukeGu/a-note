import { Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { CommentService } from 'src/comment/comment.service';
import { NoteService } from './note.service';

@Resolver('Note')
export class NoteResolver {
  constructor(
    private noteService: NoteService,
    private commentService: CommentService,
  ) {}
  @Query()
  notes() {
    return this.noteService.showAll();
  }

  @ResolveProperty()
  comments(@Parent() note) {
    return this.commentService.showByNote(note.id);
  }
}
