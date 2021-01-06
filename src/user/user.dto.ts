import { IsNotEmpty } from 'class-validator';
import { NoteEntity } from 'src/note/note.entity';

export class UserDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class UserRO {
  id: string;
  created: Date;
  username: string;
  token?: string;
  notes: NoteEntity[];
  bookmarks?: NoteEntity[];
}
