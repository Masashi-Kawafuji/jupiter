import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import User from './user';
import Post from './post';

@Entity()
class Tag {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  public name: string;

  // relationships
  @ManyToOne(() => User, (user) => user.tags)
  public readonly user: User;

  @ManyToMany(() => Post)
  @JoinTable()
  public posts: Post[];
}

export default Tag;
