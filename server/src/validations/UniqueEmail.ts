import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getManager } from 'typeorm';
import User from '../entities/user';

@ValidatorConstraint({ name: 'uniqueEmail', async: true })
class UniqueEmail implements ValidatorConstraintInterface {
  /* eslint-disable class-methods-use-this */
  public validate(email: string): Promise<boolean> {
    const manager = getManager();
    return manager.findOne(User, { email }).then((user) => !user);
  }

  public defaultMessage(): string {
    return '($value)はすでに使用されています。';
  }
}

export default UniqueEmail;
