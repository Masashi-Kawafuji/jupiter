import { EntityRepository, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import User, { UserCreationAttributes } from '../entities/user';

@EntityRepository(User)
class UserRepository extends Repository<User> {
  private saltRounds = 10;

  public saveWithPasswordHash(user: User): Promise<User | undefined> {
    bcrypt.hash(user.password, this.saltRounds, (error, passwordHash) => {
      if (error) throw error;
      user.passwordHash = passwordHash;
    });
    return this.save(user);
  }
}

export default UserRepository;
