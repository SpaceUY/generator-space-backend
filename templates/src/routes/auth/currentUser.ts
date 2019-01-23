import { Router } from 'express';
import withAuth from '../../middleware/withAuth';
import User from '../../models/definitions/User';
import { InstanceType } from 'typegoose';

const app = Router();

app.get('/', withAuth, (req, res) => {
  const user = (req as any).user as InstanceType<User>;
  return res.json({ success: true, message: user.getUserSafe() });
});

export default app;
