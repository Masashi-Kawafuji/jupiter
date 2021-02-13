import { RequestHandler } from 'express';
import { getCustomRepository } from 'typeorm';
import { validate } from 'class-validator';
import bcrypt from 'bcrypt';
import User from '../entities/user';
import UserRepository from '../repositories/UserRepository';
import { sendActivateToken } from '../services/userService';

export const createUser: RequestHandler = async (req, res, next) => {
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
    try {
      await sendActivateToken(user);
      res.status(201).json({ message: 'ユーザー登録が完了しました。' });
    } catch (error) {
      next(error);
    }
  }
};

export const activateUser: RequestHandler = async (req, res) => {
  const { email, activateToken } = req.query as { [x: string]: string };
  const userRepository = getCustomRepository(UserRepository);
  const user = await userRepository.findOne({ email });

  if (user && activateToken) {
    const isActivateTokenValid = await bcrypt.compare(
      activateToken,
      user.activateTokenHash
    );

    if (isActivateTokenValid) {
      await userRepository.activate(user);
      res.json({ message: 'アカウントの有効化に成功しました。' });
    }
  }

  res.status(400).json({ message: 'URLが無効です。' });
};
