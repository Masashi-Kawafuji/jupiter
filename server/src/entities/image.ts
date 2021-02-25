import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import Post from './post';

@Entity()
class Image {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  public url: string;

  @CreateDateColumn()
  public readonly createdAt: Date;

  @UpdateDateColumn()
  public readonly updatedAt: Date;

  @ManyToOne(() => Post, (post) => post.images, { onDelete: 'CASCADE' })
  public post: Post;
}

export default Image;
