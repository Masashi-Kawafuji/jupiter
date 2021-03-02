import { Router } from 'express';
import multer from 'multer';
import * as postController from '../controllers/postController';

const postRouter = Router();

const upload = multer();

postRouter
  .get('/posts', postController.postList)
  .post('/posts', upload.array('image', 4), postController.createPost)
  .put('/posts/:postId', upload.array('image'), postController.updatePost)
  .delete('/posts/:postId', postController.deletePost);

export default postRouter;
