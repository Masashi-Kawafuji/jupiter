import { RequestHandler } from 'express';
import { getManager, getCustomRepository } from 'typeorm';
import { validate } from 'class-validator';
import jwt from 'jsonwebtoken';
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
      await sendActivateToken(email);
      res.status(201).json({ message: 'ユーザー登録が完了しました。' });
    } catch (error) {
      next(error);
    }
  }
};

export const activateUser: RequestHandler = async (req, res) => {
  const { token } = req.query as { [x: string]: string };

  try {
    const { email } = jwt.verify(token, 'hmac_secret') as { email: string };
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne({ email });

    if (user) {
      await userRepository.update(user.id, { activated: true });
      res.json({ message: 'アカウントの有効化に成功しました。' });
    }
  } catch {
    res.status(404).json({ message: 'URLが無効です。' });
  }
};

export const updateUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name, email, avatar } = req.body;
  const manager = getManager();
  const user = await manager.findOne(User, id);
  if (user) {
    manager.merge(User, user, { name, email, avatar });
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(442).json(errors);
    } else {
      await manager.save(user);
      res.json(user);
    }
  } else {
    res.status(404).json({ message: 'ユーザーは見つかりませんでした。' });
  }
};

export const deleteUser: RequestHandler = async (req, res) => {
  const manager = getManager();
  const { id } = req.params;
  await manager.delete(User, id);
  res.status(204).end();
};
