import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import Post from './post';
import Comment from './Comment';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 20 })
  public name: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public hashedPassword: string;

  @Column({ nullable: true })
  public avatar: string;

  @Column({ default: false })
  public activated: boolean;

  @Column()
  public hashedActivateToken: string;

  @Column()
  public hashedResetPasswordToken: string;

  @CreateDateColumn()
  public readonly createdAt: Date;

  @UpdateDateColumn()
  public readonly updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.user)
  public comments: Comment[];

  @OneToMany(() => Post, (post) => post.user)
  public post: Post[];
}

export default User;
