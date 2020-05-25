import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import { devConfig } from '../../config/env/development';
import User from '../module/user/user.model';

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.

export const configureGoogleStrategy = () => {
  passport.use(
    new OAuth2Strategy(
      {
        clientID: devConfig.google.clientId,
        clientSecret: devConfig.google.clientSecret,
        callbackURL: devConfig.google.callbackUrl,
      },
      async (token, tokenSecret, profile, done) => {
        try {
          // User.findOrCreate({ googleId: profile.id }, (err, user) => done(err, user));
          //   console.log('token: ', token);
          //   console.log('tokenSecret: ', tokenSecret);
          //   console.log('profile: ', profile);
          //   done(null, profile);

          // find the user by google id
          const user = await User.findOne({ 'google.id': profile.id });
          if (user) {
            // if user exit
            // return this user
            return done(null, user);
          }

          // otherwise create the user with google
          // save accessToken, email, displayName, id
          const newUser = new User({});

          newUser.google.id = profile.id;
          newUser.google.token = token;
          newUser.google.displayName = profile.displayName;
          const email =
            profile.emails.isArray() && profile.emails.length
              ? profile.emails[0].value
              : null;
          newUser.google.email = email;
          await newUser.save();
          done(null, newUser);
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
