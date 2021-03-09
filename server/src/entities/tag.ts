import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import User from './user';
import Post from './post';

@Entity()
class Tag {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  // relations
  @ManyToOne(() => User, (user) => user.tags, { onDelete: 'CASCADE' })
  public readonly user: User;

  @ManyToMany(() => Post)
  public posts: Post[];
}

export default Tag;
