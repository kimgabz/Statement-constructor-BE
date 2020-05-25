import express from 'express';
import { statementRouter } from './module/Statement';
import { clientRouter } from './module/client';
import { userRouter } from './module/user/user.router';
import { authRouter } from './module/auth';

export const restRouter = express.Router();

restRouter.use('/client', clientRouter);
restRouter.use('/statements', statementRouter);
restRouter.use('/user', userRouter);
restRouter.use('/auth', authRouter);
