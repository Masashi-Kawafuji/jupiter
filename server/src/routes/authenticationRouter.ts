import { Router } from 'express';
import * as authenticationController from '../controllers/authenticationController';

const authenticationRouter = Router();

authenticationRouter
  .post('/sign-in', authenticationController.signIn)
  .get('/auto-sign-in', authenticationController.autoSignIn)
  .delete('/sign-out', authenticationController.signOut);

export default authenticationRouter;
