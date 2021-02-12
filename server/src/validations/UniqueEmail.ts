import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getManager } from 'typeorm';
import User from '../entities/user';

@ValidatorConstraint({ name: 'uniqueEmail', async: true })
class UniqueEmail implements ValidatorConstraintInterface {
  /* eslint-disable class-methods-use-this */
  public validate(email: string) {
    const manager = getManager();
    return manager.findOne(User, { email }).then((user) => {
      return !user;
    });
  }

  public defaultMessage() {
    return '($value)はすでに使用されています。';
  }
}

export default UniqueEmail;
