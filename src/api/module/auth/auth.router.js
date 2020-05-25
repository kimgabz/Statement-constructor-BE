import express from 'express';
import passport from 'passport';
import authController from './auth.controller';

export const authRouter = express.Router();

// for testing only
// authRouter.route('/test').get((req, res) => {
//   res.json({ message: 'working' });
// });

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    // scope: ['https://www.googleapis.com/auth/plus.login'],
  })
);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/failure' }),
  authController.sendJWTToken
  //   (req, res) => {
  //     console.log(req.user);
  //     console.log(req.isAuthenticated());
  //     res.json({ msg: 'authenticated' });
  //   }
);

// Twitter
authRouter.get('/twitter', passport.authenticate('twitter'));

authRouter.get(
  '/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/failure' }),
  authController.sendJWTToken
);

// Github
authRouter.get('/github', passport.authenticate('github'));

authRouter.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/failure' }),
  authController.sendJWTToken
);

authRouter.get(
  '/authenticate',
  passport.authenticate('jwt', { session: false }),
  authController.authenticate
);
authRouter.get(
  '/logout',
  passport.authenticate('jwt', { session: false }),
  authController.logout
);
