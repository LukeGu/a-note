import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRO } from './user.dto';
import { NoteEntity } from 'src/note/note.entity';
import { type } from 'os';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @OneToMany(
    type => NoteEntity,
    note => note.author,
  )
  notes: NoteEntity[];

  @ManyToMany(type => NoteEntity, { cascade: true })
  @JoinTable()
  bookmarks: NoteEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject(showToken = true): UserRO {
    const { id, created, username, token, notes } = this;
    const responseObj: UserRO = { id, created, username, notes };
    if (showToken) {
      responseObj.token = token;
    }
    if (this.notes) {
      responseObj.notes = this.notes;
    }
    if (this.bookmarks) {
      responseObj.bookmarks = this.bookmarks;
    }
    return responseObj;
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  private get token() {
    const { id, username } = this;
    return jwt.sign(
      {
        id,
        username,
      },
      process.env.SECRET,
      { expiresIn: '7d' },
    );
  }
}
