import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import session from 'express-session';
import pdf from 'express-pdf';

import { configureJWTStrategy } from './passport-jwt';
import { configureGoogleStrategy } from './passport-google';
import { configureTwitterStrategy } from './passport-twitter';
import { configureGithubStrategy } from './passport-github';
import swaggerDocument from '../../config/swagger.json';
import { devConfig } from '../../config/env/development';

import User from '../module/user/user.model';

export const setGlobalMiddleware = (app) => {
  app.use(cors());
  app.use(pdf);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(logger('dev'));
  app.use(
    session({
      secret: devConfig.secret,
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize()); // app.use(passport.initialize({ userProperty: 'currentUser' }));
  app.use(passport.session());

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      explorer: true,
    })
  );

  configureJWTStrategy();
  configureGoogleStrategy();
  configureTwitterStrategy();
  configureGithubStrategy();

  // save user into session
  // req.session.user = {userId}
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  // extract the userId from session
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(null, user);
    });
    // done(null, { id: 'deseralizeUser' });
  });

  app.get('/failure', (req, res) =>
    res.redirect('http://localhost:4200/login')
  );
};
