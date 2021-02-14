import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { SentMessageInfo } from 'nodemailer';
import { getCustomRepository } from 'typeorm';
import path from 'path';
import User from '../entities/user';
import Mailer from '../lib/mailer';
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

export function sendActivateToken(user: User): Promise<SentMessageInfo> {
  return new Mailer().deliverMail({
    to: user.email,
    subject: 'アカウントを有効化してください。',
    templateFile: path.resolve(
      __dirname,
      '../templates/mail/send-activate-token.ejs'
    ),
    data: {
      email: user.email,
      activateToken: user.activateToken,
    },
  });
}
