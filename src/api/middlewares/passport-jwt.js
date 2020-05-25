import PassportJWT from 'passport-jwt';
import passport from 'passport';
import { devConfig } from '../../config/env/development';
import User from '../module/user/user.model';

export const configureJWTStrategy = () => {
  const opts = {};
  opts.jwtFromRequest = PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = devConfig.secret;

  passport.use(
    new PassportJWT.Strategy(opts, (payload, done) => {
      User.findOne({ _id: payload.id }, (error, user) => {
        if (error) {
          return done(error, false);
        }
        if (user) {
          return done(null, user);
        }
        return done(null, false);
        // or you could create a new account
      });
    })
  );
};
