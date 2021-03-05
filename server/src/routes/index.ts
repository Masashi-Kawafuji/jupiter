import express from 'express';
import authenticationRouter from './authenticationRouter';
import userRouter from './userRouter';
import postRouter from './postRouter';
import commentRouter from './commentRouter';
import requireLogin from './middlewares/requireLogin';
import requireEmailVerification from './middlewares/requireEmailVerification';

const routes = express();

routes.use(
  requireLogin((req) => {
    const regex = new RegExp('.*/me.*', 'i');
    return regex.test(req.path);
  }),
  requireEmailVerification
);
routes.use(authenticationRouter);
routes.use(userRouter);
routes.use('/users/me', postRouter, commentRouter);

export default routes;
