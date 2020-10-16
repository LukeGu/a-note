import { UserEntity } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';

@Entity('note')
export class NoteEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(
    type => UserEntity,
    author => author.notes,
  )
  author: UserEntity;
}
