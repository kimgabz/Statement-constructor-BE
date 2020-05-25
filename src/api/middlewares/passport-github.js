import passport from 'passport';
import GithubStrategy from 'passport-github';
import { devConfig } from '../../config/env/development';
import User from '../module/user/user.model';

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
export const configureGithubStrategy = () => {
  passport.use(
    new GithubStrategy.Strategy(
      {
        clientID: devConfig.github.clientId,
        clientSecret: devConfig.github.clientSecret,
        callbackURL: devConfig.github.callbackURL,
      },
      async (token, tokenSecret, profile, done) => {
        try {
          //   console.log('token: ', token);
          //   console.log('tokenSecret: ', tokenSecret);
          //   console.log('profile: ', profile);
          //   done(null, profile);
          // find the user by github id
          const user = await User.findOne({ 'github.id': profile.id });
          console.log(profile);
          if (user) {
            return done(null, user);
          }
          const newUser = new User({});
          newUser.github.id = profile.id;
          newUser.github.token = token;
          newUser.github.displayName = profile.displayName;
          const email =
            profile.emails.isArray() && profile.emails.length
              ? profile.emails[0].value
              : null;
          newUser.github.email = email;
          await newUser.save();
          done(null, newUser);
        } catch (err) {
          console.error(err);
          return done(err);
        }
      }
    )
  );
};
