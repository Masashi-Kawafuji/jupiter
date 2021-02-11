import express from 'express';
import { requireLogin } from '../lib/authentication';
import userRouter from './userRouter';
import postRouter from './postRouter';
import commentRouter from './commentRouter';

const routes = express();

routes.all('*', requireLogin);
routes.use(userRouter);
routes.use('users/:userId', postRouter);
routes.use('/posts/:postId', commentRouter);

export default routes;
