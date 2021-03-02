import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsDate, IsNotEmpty } from 'class-validator';
import Comment from './comment';
import User from './user';
import Image from './image';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column('date')
  @IsDate()
  public date: Date;

  @Column('text', { nullable: true })
  @IsNotEmpty({
    message: '本文を入力してください。',
  })
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

  @OneToMany(() => Comment, (comment) => comment.post, { eager: true })
  public comments: Comment[];

  @OneToMany(() => Image, (image) => image.post, {
    eager: true,
    cascade: true,
  })
  public images: Image[];
}

export default Post;
