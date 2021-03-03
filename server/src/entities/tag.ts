import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import User from './user';

@Entity()
class Tag {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  public name: string;

  // relationships
  @ManyToOne(() => User, (user) => user.tags)
  public readonly user: User;
}

export default Tag;
