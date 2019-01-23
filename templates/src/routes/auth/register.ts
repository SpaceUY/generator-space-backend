import { Router } from 'express';
import requires from '../../middleware/requires';
import { UserModel } from '../../models';

const app = Router();

app.post(
  '/',
  requires({ body: ['firstName', 'lastName', 'email', 'username', 'password'] }),
  async (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;
    try {
      const user = new UserModel({
        firstName,
        lastName,
        email,
        username,
        isAdmin: true,
      });

      await user.generateHash(password);
      await user.save();

      return res.json({
        success: true,
        message: await user.getJWT(),
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e });
    }
  },
);

export default app;
