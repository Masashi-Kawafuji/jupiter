import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import Comment from './comment';
import User from './user';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column('date')
  public date: Date;

  @Column('text', { nullable: true })
  public body: string;

  @Column({ nullable: true })
  public publishedAt: Date;

  @CreateDateColumn()
  public readonly createdAt: Date;

  @UpdateDateColumn()
  public readonly updatedAt: Date;

  // relationships
  @ManyToOne(() => User, (user) => user.comments)
  public readonly user: User;

  @OneToMany(() => Comment, (comment) => comment.post, { onDelete: 'CASCADE' })
  public comments: Comment[];
}

export default Post;
