import { IsString } from 'class-validator';
import { UserRO } from 'src/user/user.dto';

export class NoteDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class NoteRO {
  id?: string;
  updated: Date;
  created: Date;
  title: string;
  description: string;
  author: UserRO;
  like?: number;
  dislike?: number;
}
