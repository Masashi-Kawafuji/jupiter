import { Request, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import User from '../entities/user';
import UserRepository from '../repositories/UserRepository';

type Payload = { userId: number };

export const getSessionUser: (req: Request) => Promise<User | undefined> = (
  req
) => {
  const { authToken } = req.signedCookies;
  try {
    const { userId } = jwt.verify(authToken, 'hmac_secret') as Payload;
    const userRepository = getCustomRepository(UserRepository);
    return userRepository.getGeneralProperties(userId);
  } catch {
    return Promise.resolve(undefined);
  }
};

export const requireLogin: RequestHandler = async (req, res, next) => {
  const user = await getSessionUser(req);
  if (user) next();
  else res.status(401).json({ message: 'ログインしてください。' });
};
