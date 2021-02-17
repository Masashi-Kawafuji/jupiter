import { Request, RequestHandler } from 'express';
import { getAuthenticatedUser } from '../../services/userService';

interface RequireLoginCallback {
  (req: Request): boolean;
}

function requireLogin(callback: RequireLoginCallback): RequestHandler {
  return async (req, res, next) => {
    if (callback(req)) {
      const user = await getAuthenticatedUser(req);
      if (user) {
        res.locals.user = user;
        next();
      } else {
        res.status(401).json({ message: 'ログインしてください。' });
      }
    } else {
      next();
    }
  };
}

export default requireLogin;
