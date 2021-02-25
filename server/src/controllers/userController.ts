import { RequestHandler } from 'express';
import { getManager, getCustomRepository } from 'typeorm';
import { validate } from 'class-validator';
import jwt from 'jsonwebtoken';
import User from '../entities/user';
import UserRepository from '../repositories/UserRepository';
import {
  sendVerifyEmailTokenMail,
  sendResetPasswordTokenMail,
} from '../services/userService';
import AvatarUploadService from '../services/avatar-upload-service';

export const createUser: RequestHandler = async (req, res, next) => {
  const { name, email, password, passwordConfirmation } = req.body;
  const user = new User();
  user.name = name;
  user.email = email;
  user.password = password;
  user.passwordConfirmation = passwordConfirmation;

  const errors = await validate(user, {
    forbidUnknownValues: true,
    validationError: { target: false },
  });
  if (errors.length > 0) {
    res.status(422).json({ errors });
  } else {
    const userRepository = getCustomRepository(UserRepository);
    await userRepository.saveWithPasswordHash(user);
    try {
      await sendVerifyEmailTokenMail(email);
      res.status(201).json({ message: 'ユーザー登録が完了しました。' });
    } catch (error) {
      next(error);
    }
  }
};

export const verifyEmail: RequestHandler = async (req, res) => {
  const { token } = req.query as Record<string, string>;

  try {
    const { email } = jwt.verify(token, 'hmac_secret') as { email: string };
    const manager = getManager();
    const user = await manager.findOne(User, { email, isEmailVerified: false });

    if (user) {
      await manager.update(User, user.id, { isEmailVerified: true });
      res.json({ message: 'アカウントの有効化に成功しました。' });
    } else {
      throw new Error();
    }
  } catch {
    res.status(404).json({ message: 'URLが無効です。' });
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  const { user } = res.locals as { user: User };

  const manager = getManager();
  manager.merge(User, user, req.body);

  const errors = await validate(user, {
    forbidUnknownValues: true,
    validationError: { target: false },
    skipMissingProperties: true,
  });

  if (errors.length > 0) {
    res.status(442).json(errors);
  } else {
    if (req.body.avatarBase64Encoded) {
      const avatarUploader = new AvatarUploadService(user.id);

      try {
        await avatarUploader.upload(req.body.avatarBase64Encoded);
        user.avatar = avatarUploader.objectUrl;
      } catch (error) {
        next(error);
      }
    }

    await manager.save(user);
    res.json(user);
  }
};

export const deleteUser: RequestHandler = async (req, res) => {
  const { user } = res.locals as { user: User };
  const manager = getManager();
  await manager.delete(User, user.id);
  res.status(204).end();
};

export const sendResetPasswordToken: RequestHandler = async (
  req,
  res,
  next
) => {
  const { email } = req.body;
  const manager = getManager();
  const user = await manager.findOne(User, { email });

  if (user) {
    try {
      const token = jwt.sign({ userId: user.id }, user.passwordHash, {
        expiresIn: '30m',
      });
      await sendResetPasswordTokenMail(email, token);
      res.json({
        message:
          'パスワードのリセットページのURLが記載されたメールを送信しました。',
      });
    } catch (error) {
      next(error);
    }
  } else {
    res.status(404).json({ message: 'ユーザーは見つかりませんでした。' });
  }
};

export const resetPassword: RequestHandler = async (req, res, next) => {
  const { token, email } = req.query as Record<string, string>;
  const manager = getManager();
  const user = await manager.findOne(User, { email });

  if (user) {
    try {
      const { userId } = jwt.verify(token, user.passwordHash) as {
        userId: number;
      };
      if (userId) {
        const { password, passwordConfirmation } = req.body;
        user.password = password;
        user.passwordConfirmation = passwordConfirmation;

        const errors = await validate(user);
        if (errors.length > 0) {
          const userRepository = getCustomRepository(UserRepository);
          await userRepository.saveWithPasswordHash(user);
          res.json({ message: 'パスワードの変更に成功しました。' });
        } else {
          res.status(422).json(errors);
        }
      }
    } catch (error) {
      next(error);
    }
  }
};
