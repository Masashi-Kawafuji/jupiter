import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import User from '../entities/user';

@ValidatorConstraint()
class PasswordEqualsToPasswordConfirmation
  implements ValidatorConstraintInterface {
  /* eslint-disable class-methods-use-this */
  validate(password: string, args: ValidationArguments): boolean {
    return password === (args.object as User).passwordConfirmation;
  }

  defaultMessage(): string {
    return 'パスワードが確認用と異なります。';
  }
}

export default PasswordEqualsToPasswordConfirmation;
