import { RequestHandler } from 'express';
import { getManager } from 'typeorm';
import { validate } from 'class-validator';
import bcrypt from 'bcrypt';
import User, { UserCreationAttributes } from '../entities/user';
import UserRepository from '../repositories/UserRepository';

// const userRepository = connection.getCustomRepository(UserRepository);

export const createUser: RequestHandler = async (req, res) => {
  const entityManager = getManager();
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
      bcrypt.hash(password, 10, async (error, passwordHash) => {
        if (error) throw error;
        user.passwordHash = passwordHash;
        const newUser = await entityManager.save(user);
        res.status(201).json({ user: newUser });
      });
    }
  });
};

export const hoge = 'hoge';
