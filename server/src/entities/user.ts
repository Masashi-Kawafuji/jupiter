import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import Post from './post';
import Comment from './comment';
import Tag from './tag';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 20 })
  public name: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public passwordHash: string;

  @Column({ nullable: true })
  public avatar: string;

  @Column({ default: false })
  public activated: boolean;

  @Column()
  public activateTokenHash: string;

  @Column()
  public resetPasswordTokenHash: string;

  @CreateDateColumn()
  public readonly createdAt: Date;

  @UpdateDateColumn()
  public readonly updatedAt: Date;

  // relationships
  @OneToMany(() => Post, (post) => post.user, { onDelete: 'CASCADE' })
  public post: Post[];

  @OneToMany(() => Comment, (comment) => comment.user, { onDelete: 'CASCADE' })
  public comments: Comment[];

  @OneToMany(() => Tag, (tag) => tag.user, { onDelete: 'CASCADE' })
  public tags: Tag[];
}

export default User;
