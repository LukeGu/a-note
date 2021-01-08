import { Query, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';

@Resolver('Comment')
export class CommentResolver {
  constructor(private commentService: CommentService) {}
  @Query()
  comments() {
    // return this.commentService.read(id);
    return;
  }
}
