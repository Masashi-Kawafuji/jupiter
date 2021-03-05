import { RequestHandler, Router } from 'express';
import { getManager } from 'typeorm';
import * as commentController from '../controllers/commentController';
import Post from '../entities/post';

const commentRouter = Router();

const preloadPost: RequestHandler = async (req, res, next) => {
  const manager = getManager();
  console.log(req.params.postId);
  const post = await manager.findOne(Post, req.params.postId);
  if (post) {
    res.locals.post = post;
    next();
  } else {
    res.status(404).json('投稿は見つかりませんでした。');
  }
};

commentRouter
  .post('/posts/:postId/comments', preloadPost, commentController.createComment)
  .delete(
    '/posts/:postId/comments/:commentId',
    preloadPost,
    commentController.deleteComment
  );

export default commentRouter;
