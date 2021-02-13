import { Request } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
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

export const authenticateUser: (
  user: User,
  password: string
) => Promise<boolean> = (user, password) =>
  bcrypt.compare(password, user.passwordHash);
