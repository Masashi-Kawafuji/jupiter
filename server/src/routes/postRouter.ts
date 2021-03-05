import { Router } from 'express';
import multer from 'multer';
import * as postController from '../controllers/postController';

const postRouter = Router();

const upload = multer();

postRouter
  .get('/posts', postController.searchByPlainText)
  .get('/posts/tags/:tagName', postController.searchByTagName)
  // .get('/posts', postController.postList)
  .get('/posts/:postId', postController.postDetail)
  .post('/posts', upload.array('image', 4), postController.createPost)
  .put('/posts/:postId', upload.array('image'), postController.updatePost)
  .delete('/posts/:postId', postController.deletePost);

export default postRouter;
