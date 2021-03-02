import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import Post from './post';
import User from './user';

@Entity()
class Comment {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column('text')
  public body: string;

  @CreateDateColumn()
  public readonly createdAt: Date;

  @UpdateDateColumn()
  public readonly updatedAt: Date;

  // relationships
  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  public readonly user: User;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  public readonly post: Post;
}

export default Comment;
