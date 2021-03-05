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
  public id: number;

  @Column()
  public url: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToOne(() => Post, (post) => post.images, { onDelete: 'CASCADE' })
  public readonly post: Post;
}

export default Image;
