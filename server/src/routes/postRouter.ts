import { Router } from 'express';
import multer from 'multer';
import * as postController from '../controllers/postController';

const postRouter = Router();

const upload = multer();

postRouter
  .get('/posts', postController.postList)
  .post(
    '/posts',
    upload.fields([{ name: 'image', maxCount: 4 }]),
    postController.createPost
  )
  .delete('/posts/:postId', postController.deletePost);

export default postRouter;
