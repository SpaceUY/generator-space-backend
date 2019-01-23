import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { UserModel } from '../models';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      const user = await UserModel.findOne({ email });
      if (user && (await user.checkPassword(password))) {
        done(null, user);
      } else {
        done('Invalid email or password', null);
      }
    },
  ),
);
