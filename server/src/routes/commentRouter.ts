import { RequestHandler, Router } from 'express';
import { getManager } from 'typeorm';
import * as commentController from '../controllers/commentController';
import Post from '../entities/post';

const commentRouter = Router();

function preloadPost(): RequestHandler {
  return async (req, res, next) => {
    const manager = getManager();
    const post = await manager.findOne(Post, req.params.postId);
    if (post) {
      res.locals.post = post;
      next();
    } else {
      res.status(404).json('投稿は見つかりませんでした。');
    }
  };
}

commentRouter.use(preloadPost);

commentRouter
  .post('/comment', commentController.createComment)
  .delete('/comment/:commentId', commentController.deleteComment);

export default commentRouter;
