import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import User from '../entities/user';
import UserRepository from '../repositories/UserRepository';

type Payload = { userId: number };

export function getSessionUser(req: Request): Promise<User | undefined> {
  const { authToken } = req.signedCookies;
  try {
    const { userId } = jwt.verify(authToken, 'hmac_secret') as Payload;
    const userRepository = getCustomRepository(UserRepository);
    return userRepository.getGeneralProperties(userId);
  } catch {
    return Promise.resolve(undefined);
  }
}

export const hoge = 'hoge';
