import express from 'express';
import passport from 'passport';
import userController from './user.controller';

export const userRouter = express.Router();

userRouter.route('/signup').post(userController.signup);

userRouter.route('/login').post(userController.login);

userRouter.route('/forgot-password').post(userController.forgotPassword);

userRouter.put(
  '/reset-password',
  passport.authenticate('jwt', { session: false }),
  userController.resetPassword
);

userRouter.post(
  '/test',
  passport.authenticate('jwt', { session: false }),
  userController.test
);
