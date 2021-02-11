import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';

export const login: RequestHandler = async (req, res, next) => {
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

export const logout: RequestHandler = (req, res) => {
  res.clearCookie('authToken').end();
};
