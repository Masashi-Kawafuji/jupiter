import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';
import { authenticateUser, getSessionUser } from '../services/userService';

export const signIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const userRepository = getCustomRepository(UserRepository);
  const user = await userRepository.findOne({ email });

  if (user) {
    const isAuthenticated = await authenticateUser(user, password);
    if (isAuthenticated) {
      const token = jwt.sign({ userId: user.id }, 'hmac_secret');
      res
        .cookie('authToken', token, {
          httpOnly: true,
          signed: true,
        })
        .json(user);
    }
  }

  res
    .status(422)
    .json({ message: 'ユーザーが存在しないか、パスワードが誤っています。' });
};

export const autoSignIn: RequestHandler = async (req, res) => {
  const user = await getSessionUser(req);
  if (user) res.json(user);
  else res.status(401).json({ message: 'ログインしてください。' });
};

export const signOut: RequestHandler = (req, res) => {
  res.status(204).clearCookie('authToken').end();
};
