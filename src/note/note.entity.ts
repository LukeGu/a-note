import { UserEntity } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
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

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  like: UserEntity[];

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  dislike: UserEntity[];
}
