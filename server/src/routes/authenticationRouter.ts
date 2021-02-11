import { Router } from 'express';
import * as authenticationController from '../controllers/authenticationController';

const authenticationRouter = Router();

authenticationRouter
  .post('/login', authenticationController.login)
  .delete('/logout', authenticationController.logout);

export default authenticationRouter;
