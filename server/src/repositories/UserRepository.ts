import { EntityRepository, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import User from '../entities/user';

@EntityRepository(User)
class UserRepository extends Repository<User> {
  public getGeneralProperties(id: number | string): Promise<User | undefined> {
    return this.findOne(id, {
      select: ['id', 'name', 'avatar', 'isEmailVerified'],
    });
  }

  public async saveWithPasswordHash(user: User): Promise<User> {
    const passwordHash = await bcrypt.hash(user.password, 10);
    this.merge(user, { passwordHash });
    return this.save(user);
  }
}

export default UserRepository;
