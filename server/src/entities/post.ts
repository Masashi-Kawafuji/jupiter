import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { IsDate, IsNotEmpty } from 'class-validator';
import Comment from './comment';
import User from './user';
import Image from './image';
import Tag from './tag';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('date')
  @IsDate()
  public date: Date;

  @Column('text')
  @IsNotEmpty({
    message: '本文を入力してください。',
  })
  public body: string;

  @Column({ nullable: true })
  public publishedAt: Date;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  // relations
  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  public readonly user: User;

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  public comments: Comment[];

  @OneToMany(() => Image, (image) => image.post, {
    eager: true,
    cascade: true,
    orphanedRowAction: 'delete',
  })
  public images: Image[];

  @ManyToMany(() => Tag, (tag) => tag.posts, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  @JoinTable()
  public tags: Tag[];
}

export default Post;
