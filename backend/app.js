// Import dependencies
import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import verify from './v1/middleware/tokenVerification.js';
import { logger, appLogger} from './v1/middleware/logger.js';
import { createClient } from 'redis';
import { readFileSync } from 'fs';
import useragent from 'express-useragent';
dotenv.config();

// Import routes
import generalRoutes from './v1/routes/general.routes.js';
import authRoutes from './v1/routes/auth.routes.js';
import adminRoutes from './v1/admin/route/admin.routes.js';

const { connect, connection } = mongoose;
const { urlencoded } = bodyParser;

// start app
const app = express();

// get environment variables
const { HOST, ENVIR, PORT } = process.env;
const { USERNAME, PASSWORD, REDISPORT } = process.env;
const url = ENVIR !== 'test'? process.env.DB : process.env.TESTDB;

// url path
const APP_PATH = '/api/v1';

// Connect to mongodb database
connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 2
});

const db = connection;

db.on('error', error => {
  logger.error('MongoDB connection error:', error);
});
db.once('open', () => {
  logger.info('MongoDB connected!');
});

// Connect to redis database
export let redisClient;

if (ENVIR !== 'test') {
  redisClient = await createClient({
    username: `${USERNAME}`,
    password: `${PASSWORD}`,
    socket: {
      host: HOST,
      port: REDISPORT,
      tls: true,
      key: readFileSync(`./${PRIKEY}`),
      cert: readFileSync(`./${CRT}`),
      ca: [readFileSync(`./${PEMFILE}`)],
      reconnectStrategy: retries => {
        if (retries > 10) return new Error('Max reconnection attempts exceeded');
        return Math.min(retries * 50, 2000);
      }
    }
  })
    .on('error', err => logger.error('Redis Client Error', err))
    .connect();

} else {
  redisClient = await createClient({socket: {
    reconnectStrategy: retries => {
      if (retries > 10) return new Error('Max reconnection attempts exceeded');
      return Math.min(retries * 50, 2000);
    }
  }})
    .on('error', err => logger.error('Redis Client Error', err))
    .connect();
}

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

// agent library
app.use(useragent.express());

// use loggers
app.use(appLogger);

// use routes
app.use(APP_PATH+'/auth', verify, authRoutes);
app.use(APP_PATH+'/admin', adminRoutes);
app.use(APP_PATH, generalRoutes);


app.listen(PORT, () => {
  logger.info(`Server is now running on port ${PORT}`);
});

export default app;
