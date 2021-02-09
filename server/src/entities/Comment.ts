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
class Comment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('text')
  public body: string;

  @CreateDateColumn()
  public readonly createdAt: Date;

  @UpdateDateColumn()
  public readonly updatedAt: Date;

  @ManyToOne(() => User, (user) => user.comments)
  public user: User;
}

export default Comment;
