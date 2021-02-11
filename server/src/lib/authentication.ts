import { Request, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { getManager } from 'typeorm';
import User from '../entities/user';

type Payload = { userId: number };

export const getSessionUser: (req: Request) => Promise<User | undefined> = (
  req
) => {
  const { authToken } = req.signedCookies;
  const { userId } = jwt.verify(authToken, 'hmac_secret') as Payload;
  const entityManager = getManager();
  return entityManager.findOne(User, userId);
};

export const requireLogin: RequestHandler = async (req, res, next) => {
  try {
    const user = await getSessionUser(req);
    if (user) next();
    else throw new Error();
  } catch (error) {
    res.status(401).json({ message: 'トークンが無効です。' });
  }
};
