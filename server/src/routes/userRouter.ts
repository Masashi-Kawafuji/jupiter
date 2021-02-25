import { Router } from 'express';
import multer from 'multer';
import * as userController from '../controllers/userController';

const userRouter = Router();

const upload = multer();

userRouter
  .post('/users', userController.createUser)
  .get('/users/verify-email', userController.verifyEmail)
  .put('/users/me', upload.single('avatar'), userController.updateUser)
  .delete('/users/me', userController.deleteUser)
  .get(
    '/users/send-reset-password-token',
    userController.sendResetPasswordToken
  )
  .put('/users/reset-password', userController.resetPassword);

export default userRouter;
