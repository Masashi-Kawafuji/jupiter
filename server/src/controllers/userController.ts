import { RequestHandler } from 'express';
import { getCustomRepository } from 'typeorm';
import { validate } from 'class-validator';
import User from '../entities/user';
import UserRepository from '../repositories/UserRepository';

export const createUser: RequestHandler = async (req, res) => {
  const { name, email, password, passwordConfirmation } = req.body;
  const user = new User();
  user.name = name;
  user.email = email;
  user.password = password;
  user.passwordConfirmation = passwordConfirmation;

  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(422).json({ errors });
  } else {
    const userRepository = getCustomRepository(UserRepository);
    await userRepository.saveWithPasswordHash(user);
    res.status(201).json({ message: 'ユーザー登録が完了しました。' });
  }
};

export const hoge = 'hoge';
