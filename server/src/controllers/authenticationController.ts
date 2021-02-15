import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';
import { getAuthenticatedUser } from '../services/userService';

export const signIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const userRepository = getCustomRepository(UserRepository);
  const user = await userRepository.findOne({ email });

  if (user) {
    const isAuthenticated = await bcrypt.compare(password, user.passwordHash);

    if (isAuthenticated) {
      const token = jwt.sign({ userId: user.id }, 'hmac_secret');
      res
        .cookie('auth-token', token, {
          httpOnly: true,
          signed: true,
        })
        .json(user);
    } else {
      res.status(422).json({
        message: 'ユーザーが存在しないか、パスワードが誤っています。',
      });
    }
  } else {
    res
      .status(422)
      .json({ message: 'ユーザーが存在しないか、パスワードが誤っています。' });
  }
};

export const autoSignIn: RequestHandler = async (req, res) => {
  const user = await getAuthenticatedUser(req);
  if (user) res.json(user);
  else res.status(401).json({ message: 'ログインしてください。' });
};

export const signOut: RequestHandler = (req, res) => {
  res.status(204).clearCookie('auth-token').end();
};
