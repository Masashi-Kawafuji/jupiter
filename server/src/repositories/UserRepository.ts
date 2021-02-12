import { EntityRepository, Repository } from 'typeorm';
import User from '../entities/user';

@EntityRepository(User)
class UserRepository extends Repository<User> {
  public getGeneralProperties(id: number | string) {
    return this.createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email', 'user.avatar'])
      .where('user.id = :id', { id })
      .getOne();
  }
}

export default UserRepository;
