import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import User from '../entities/user';

const IsPasswordCorrect = (
  property: string,
  validationOptions?: ValidationOptions
) => {
  return (object: User, propertyName: string) => {
    registerDecorator({
      name: 'isPasswordCorrect',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const relatedValue = (args.object as User).passwordConfirmation;
          return value === relatedValue;
        },
      },
    });
  };
};

export default IsPasswordCorrect;
