import { Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { CommentService } from 'src/comment/comment.service';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private userService: UserService,
    private commentService: CommentService,
  ) {}
  @Query()
  users() {
    return this.userService.showAll();
  }

  @ResolveProperty()
  comments(@Parent() user) {
    return this.commentService.showByUser(user.id);
  }
}
