import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';
import { getSessionUser } from '../lib/authentication';

export const signIn: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  const userRepository = getCustomRepository(UserRepository);
  const user = await userRepository.findOne({ email });
  try {
    if (user) {
      bcrypt.compare(password, user.passwordHash, (error, result) => {
        if (error) next(error);

        if (result) {
          const token = jwt.sign({ userId: user.id }, 'hmac_secret');
          res
            .cookie('authToken', token, {
              httpOnly: true,
              signed: true,
            })
            .json(user);
        } else {
          throw new Error();
        }
      });
    } else {
      throw new Error();
    }
  } catch (error) {
    res
      .status(422)
      .json({ message: 'ユーザーが存在しないか、パスワードが誤っています。' });
  }
};

export const autoSignIn: RequestHandler = async (req, res) => {
  const user = await getSessionUser(req);
  if (user) res.json(user);
  else res.status(401).json({ message: 'ログインしてください。' });
};

export const signOut: RequestHandler = (req, res) => {
  res.clearCookie('authToken').end();
};
