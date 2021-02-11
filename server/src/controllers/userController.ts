import { RequestHandler } from 'express';
import { getManager } from 'typeorm';
import { validate } from 'class-validator';
import bcrypt from 'bcrypt';
import User from '../entities/user';

export const createUser: RequestHandler = async (req, res, next) => {
  const manager = getManager();

  const { name, email, password, passwordConfirmation } = req.body;
  const user = new User();
  user.name = name;
  user.email = email;
  user.password = password;
  user.passwordConfirmation = passwordConfirmation;

  validate(user).then(async (errors) => {
    if (errors.length > 0) {
      res.status(422).json({ errors });
    } else {
      bcrypt.hash(user.password, 10, async (error, passwordHash) => {
        if (error) next(error);
        user.passwordHash = passwordHash;
        const newUser = await manager.save(user);
        res.status(201).json({ user: newUser });
      });
    }
  });
};

export const hoge = 'hoge';
