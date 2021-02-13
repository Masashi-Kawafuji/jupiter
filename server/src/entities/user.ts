import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsEmail, Length, Validate } from 'class-validator';
import UniqueEmail from '../validations/UniqueEmail';
import PasswordEqualsToPasswordConfirmation from '../validations/PasswordEqualsToPasswordConfirmation';
import Post from './post';
import Comment from './comment';
import Tag from './tag';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Length(4, 20, { message: 'ユーザー名は4文字以上、20文字以下です。' })
  @Column({ length: 20 })
  public name: string;

  @IsEmail()
  @Validate(UniqueEmail)
  @Column({ unique: true })
  public email: string;

  @Column()
  public passwordHash: string;

  @Column({ nullable: true })
  public avatar: string;

  @Column({ default: false })
  public activated: boolean;

  @Column({ nullable: true })
  public activateTokenHash: string;

  @Column({ nullable: true })
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

  @Length(8, 20)
  @Validate(PasswordEqualsToPasswordConfirmation)
  public password: string;

  public passwordConfirmation: string;

  public activateToken: string;
}

export default User;
