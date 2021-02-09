import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import User from './user';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id: number;

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

  @ManyToOne(() => User, (user) => user.comments)
  public user: User;
}

export default Post;
