import { Router } from 'express';
import * as userController from '../controllers/userController';

const userRouter = Router();

userRouter.post('/users', userController.createUser);
export default userRouter;
