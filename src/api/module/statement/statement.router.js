import express from 'express';
import passport from 'passport';
import statementController from './statement.controller';

export const statementRouter = express.Router();

statementRouter
  .route('/')
  .post(
    passport.authenticate('jwt', { session: false }),
    statementController.create
  )
  .get(
    passport.authenticate('jwt', { session: false }),
    statementController.findAll
  );

statementRouter
  .route('/:id')
  .put(
    passport.authenticate('jwt', { session: false }),
    statementController.update
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    statementController.delete
  )
  .get(
    passport.authenticate('jwt', { session: false }),
    statementController.findOne
  );

statementRouter.get(
  '/:id/download',
  passport.authenticate('jwt', { session: false }),
  statementController.download
);
