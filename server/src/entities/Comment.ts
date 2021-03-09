import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Tree,
  CreateDateColumn,
  UpdateDateColumn,
  TreeChildren,
  TreeParent,
  TreeLevelColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import Post from './post';
import User from './user';

@Entity()
@Tree('nested-set')
class Comment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('text')
  @IsNotEmpty({ message: '本文が入力されていません。' })
  public body: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  // relations
  @ManyToOne(() => User, (user) => user.comments, {
    eager: true,
    onDelete: 'CASCADE',
  })
  public readonly user: User;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  public readonly post: Post;

  @TreeChildren({ cascade: true })
  public children: Comment[];

  @TreeParent()
  public readonly parent: Comment;
}

export default Comment;
