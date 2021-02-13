import { RequestHandler } from 'express';
import { getManager, getCustomRepository } from 'typeorm';
import { validate } from 'class-validator';
import bcrypt from 'bcrypt';
import User from '../entities/user';
import UserRepository from '../repositories/UserRepository';
import sendActivateToken from '../services/mailerService';

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

  if (user) {
    const isActivateTokenValid = await bcrypt.compare(
      activateToken,
      user.activateTokenHash
    );

    if (isActivateTokenValid) {
      await userRepository.activate(user);
      res.json({ message: 'アカウントの有効化に成功しました。' });
    }
  }

  res.status(404).json({ message: 'URLが無効です。' });
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
