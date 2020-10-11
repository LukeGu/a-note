import { IsString } from 'class-validator';

export class NoteDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
