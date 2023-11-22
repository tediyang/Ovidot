// Import dependencies
import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import verify from './v1/middleware/tokenVerification.js';

// Import routes
import generalRoutes from './v1/routes/general.routes.js';
import authRoutes from './v1/routes/auth.routes.js';
import adminRoutes from './v1/admin/route/admin.routes.js';

// Import middlewares
// import loggerMiddleware from './v1/middleware/logger.middleware.js';
// import errorHandle from './v1/middleware/error.middleware.js';

dotenv.config()
const { connect, connection } = mongoose;
const { urlencoded } = bodyParser;

// start app
const app = express();
const { HOST, DB, PORT } = process.env;

// url path
const APP_PATH = '/api/v1';

// Connect to database
connect(`mongodb://${HOST}/${DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 2
});

const db = connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connected!');
});

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

// use routes
app.use(APP_PATH+'/auth', verify, authRoutes);
app.use(APP_PATH+'/admin', adminRoutes);
app.use(APP_PATH, generalRoutes);

// app.use(loggerMiddleware);
// app.use(errorHandle);

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
