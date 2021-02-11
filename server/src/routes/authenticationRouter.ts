import { Router } from 'express';
import * as authenticationController from '../controllers/authenticationController';

const authenticationRouter = Router();

authenticationRouter
  .post('/login', authenticationController.signIn)
  .get('/autoSignIn', authenticationController.autoSignIn)
  .delete('/logout', authenticationController.signOut);

export default authenticationRouter;
