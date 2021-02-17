import { RequestHandler } from 'express';
import User from '../../entities/user';

function requireEmailVerification(): RequestHandler {
  return (req, res, next) => {
    const { user } = res.locals as { user: User };
    if (user) {
      if (user.isEmailVerified) {
        next();
      } else {
        res
          .status(400)
          .json({ message: 'メールアドレスの確認ができていません。' });
      }
    } else {
      next();
    }
  };
}

export default requireEmailVerification;
