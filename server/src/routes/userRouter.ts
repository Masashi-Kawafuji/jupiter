import { Router } from 'express';
import * as userController from '../controllers/userController';

const userRouter = Router();

userRouter
  .post('/users', userController.createUser)
  .get('/users/activate', userController.activateUser)
  .put('/users/me', userController.updateUser)
  .delete('/users/me', userController.deleteUser)
  .get(
    '/users/send-reset-password-token',
    userController.sendResetPasswordToken
  )
  .put('/users/change-password', userController.changePassword);

export default userRouter;
