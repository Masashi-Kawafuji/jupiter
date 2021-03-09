import { RequestHandler, Router } from 'express';
import { getManager } from 'typeorm';
import * as commentController from '../controllers/commentController';
import Comment from '../entities/comment';
import Post from '../entities/post';

const commentRouter = Router();

const preloadPost: RequestHandler = async (req, res, next) => {
  const manager = getManager();
  const post = await manager.findOne(Post, req.params.postId);

  if (post) {
    res.locals.post = post;
    next();
  } else {
    res.status(404).json('投稿は見つかりませんでした。');
  }
};

const preloadComment: RequestHandler = async (req, res, next) => {
  const post = res.locals.post as Post;
  const manager = getManager();
  const comment = await manager.findOne(Comment, req.params.commentId, {
    where: { post },
  });

  if (comment) {
    res.locals.comment = comment;
    next();
  } else {
    res.status(404).json('コメントが見つかりませんでした。');
  }
};

commentRouter
  .post('/posts/:postId/comments', preloadPost, commentController.createComment)
  .post(
    '/posts/:postId/comments/:commentId/reply',
    preloadPost,
    preloadComment,
    commentController.replyToComment
  )
  .delete(
    '/posts/:postId/comments/:commentId',
    preloadPost,
    commentController.deleteComment
  );

export default commentRouter;
