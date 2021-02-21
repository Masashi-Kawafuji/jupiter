import { Router } from 'express';
import * as postController from '../controllers/postController';

const postRouter = Router();

postRouter
  .get('/posts', postController.postList)
  .post('/posts', postController.createPost)
  .delete('/posts/:postId', postController.deletePost);

export default postRouter;
