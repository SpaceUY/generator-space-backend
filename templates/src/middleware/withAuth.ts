import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserModel } from '../models';

/**
 * Middleware for Express. Gets id from JWT and sets User to req.user
 */
export default async function withAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.get('Authorization');
  if (auth && (auth as string).split(' ')[0] === 'Token') {
    const token = (auth as string).split(' ')[1];
    try {
      const tokenObj = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      if (tokenObj.id) {
        (req as any).user = await UserModel.findById(tokenObj.id);
        next();
      } else {
        throw 'Invalid Token';
      }
    } catch (e) {
      return res.status(401).json({ success: false, message: e });
    }
  } else {
    return res.status(401).json({ success: false, message: 'No Token Found' });
  }
}
