import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { SentMessageInfo } from 'nodemailer';
import { getCustomRepository } from 'typeorm';
import User from '../entities/user';
import Mailer from '../lib/mailer';
import UserRepository from '../repositories/UserRepository';

export async function getAuthenticatedUser(
  req: Request
): Promise<User | undefined> {
  const authToken = req.signedCookies['auth-token'];

  try {
    const { userId } = jwt.verify(authToken, 'hmac_secret') as {
      userId: number;
    };
    const userRepository = getCustomRepository(UserRepository);
    return userRepository.getGeneralProperties(userId);
  } catch {
    return Promise.resolve(undefined);
  }
}

export function sendVerifyEmailTokenMail(
  email: string
): Promise<SentMessageInfo> {
  const token = jwt.sign({ email }, 'hmac_secret', { expiresIn: '24h' });
  const url = `${process.env.HOST_NAME}/users/vefiry-email?token=${token}`;

  return Mailer.deliverMail({
    to: email,
    subject: 'アカウントを有効化してください。',
    template: 'verify-email-token',
    data: { url },
  });
}

export function sendResetPasswordTokenMail(
  email: string,
  token: string
): Promise<SentMessageInfo> {
  const url = `${process.env.HOST_NAME}/users/reset-password?token=${token}`;
  return Mailer.deliverMail({
    to: email,
    subject: 'パスワードをリセットしてください。',
    template: 'reset-password',
    data: { url },
  });
}
