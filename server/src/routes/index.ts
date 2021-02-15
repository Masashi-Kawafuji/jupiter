import express from 'express';
import authenticationRouter from './authenticationRouter';
import userRouter from './userRouter';
import postRouter from './postRouter';
import commentRouter from './commentRouter';
import requireLogin from './middlewares/requireLogin';
import { createUser } from '../controllers/userController';

const routes = express();
routes.post('/users', createUser);
routes.use(authenticationRouter);
routes.all('*', requireLogin);
routes.use(userRouter);
routes.use('users/:userId', postRouter);
routes.use('/posts/:postId', commentRouter);

export default routes;
