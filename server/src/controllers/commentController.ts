import { RequestHandler } from 'express';
import { getManager } from 'typeorm';
import { validate } from 'class-validator';
import Comment from '../entities/comment';
import Post from '../entities/post';
import User from '../entities/user';

type CommentControllerLocals = {
  user: User;
  post: Post;
  comment?: Comment;
};

export const createComment: RequestHandler = async (req, res) => {
  const { user, post } = res.locals as CommentControllerLocals;
  const manager = getManager();
  const comment = manager.create(Comment, { ...req.body, user, post });

  const errors = await validate(comment, {
    forbidUnknownValues: true,
    validationError: { target: false },
  });

  if (errors.length > 0) {
    res.status(422).json(errors);
  } else {
    await manager.save(comment);
    res.status(201).json(comment);
  }
};

export const replyToComment: RequestHandler = async (req, res) => {
  const { comment } = res.locals as CommentControllerLocals;

  const manager = getManager();
  const reply = manager.create(Comment, { ...req.body, parent: comment });

  const errors = await validate(reply, {
    forbidUnknownValues: true,
    validationError: { target: false },
  });

  if (errors.length > 0) {
    res.status(422).json(errors);
  } else {
    await manager.save(reply);
    res.status(201).json(reply);
  }
};

export const deleteComment: RequestHandler = async (req, res) => {
  const { user, post } = res.locals as CommentControllerLocals;
  const manager = getManager();
  const comment = await manager.findOne(Comment, req.params.commentId, {
    where: { user, post },
  });

  if (comment) {
    await manager.remove(comment);
    res.status(204).end();
  } else {
    res.status(404).json('コメントは見つかりませんでした。');
  }
};
