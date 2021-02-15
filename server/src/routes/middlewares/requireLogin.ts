import { RequestHandler } from 'express';
import { getAuthenticatedUser } from '../../services/userService';

const requireLogin: RequestHandler = async (req, res, next) => {
  const user = await getAuthenticatedUser(req);
  if (user) {
    res.locals.user = user;
    next();
  } else {
    res.status(401).json({ message: 'ログインしてください。' });
  }
};

export default requireLogin;
