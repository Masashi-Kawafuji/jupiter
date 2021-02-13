import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import bcrypt from 'bcrypt';
import User from '../entities/user';

@EntityRepository(User)
class UserRepository extends Repository<User> {
  public getGeneralProperties(id: number | string): Promise<User | undefined> {
    return this.createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email', 'user.avatar'])
      .where('user.id = :id', { id })
      .getOne();
  }

  public async saveWithPasswordHash(user: User): Promise<User> {
    const passwordHash = await bcrypt.hash(user.password, 10);
    this.merge(user, { passwordHash });
    return this.save(user);
  }

  public activate(user: User): Promise<UpdateResult> {
    return this.update(user.id, {
      activated: true,
      activateTokenHash: undefined,
    });
  }
}

export default UserRepository;
