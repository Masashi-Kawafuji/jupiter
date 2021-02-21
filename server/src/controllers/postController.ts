import { RequestHandler } from 'express';
import { getManager, IsNull } from 'typeorm';
import { validate } from 'class-validator';
import Post from '../entities/post';
import User from '../entities/user';

export const postList: RequestHandler = async (req, res) => {
  const { user } = res.locals as { user: User };
  const manager = getManager();
  const posts = await manager.find(Post, {
    where: { userId: user.id, publishedAt: !IsNull() },
    order: {
      publishedAt: 'DESC',
    },
  });
  res.json(posts);
};

export const createPost: RequestHandler = async (req, res) => {
  const { user } = res.locals as { user: User };
  const manager = getManager();
  const post = manager.create(Post, {
    ...req.body,
    date: new Date(req.body.date),
    userId: user.id,
  });

  const errors = await validate(post, {
    forbidUnknownValues: true,
    validationError: { target: false },
  });

  if (errors.length > 0) {
    res.status(422).json(errors);
  } else {
    await manager.save(post);
    res.status(201).json(post);
  }
};

export const deletePost: RequestHandler = async (req, res) => {
  const { user } = res.locals as { user: User };
  const manager = getManager();
  const post = await manager.findOne(Post, req.params.id, {
    where: { userId: user.id },
  });

  if (post) {
    await manager.remove(post);
    res.status(204).end();
  } else {
    res.status(404).json({ message: '投稿が見つかりませんでした。' });
  }
};
