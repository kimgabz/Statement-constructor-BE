import express from 'express';
import mongoose from 'mongoose';

// import { router } from './config/routes';
import { restRouter } from './api';
import { devConfig } from './config/env/development';
import { setGlobalMiddleware } from './api/middlewares/global-middleware';

// mongoose.Promise = global.Promise; for mongoose 4.0 only
mongoose.set('useCreateIndex', true); // (node:4335) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.connect(`mongodb://localhost/${devConfig.database}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
const PORT = devConfig.port;

// register global middleware
setGlobalMiddleware(app);

/* for testing */
// app.get('/', (req, res) => {
//   res.json({
//     msg: 'Welcome to Statement builder backend',
//   });
// });

app.use('/api', restRouter);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.message = 'Invalid route';
  error.status = 404;
  next(error);
});

app.use((error, req, res /*, next*/) => {
  res.status(error.status || 500);
  return res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`server is running at PORT ${PORT}`);
});
