import { RequestHandler } from 'express';
import { getSessionUser } from '../services/userService';

const requireLogin: RequestHandler = async (req, res, next) => {
  const user = await getSessionUser(req);
  if (user) next();
  else res.status(401).json({ message: 'ログインしてください。' });
};

export default requireLogin;
