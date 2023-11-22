// Import dependencies
require('dotenv').config();
import express, { json } from 'express';
import cors from 'cors';
import { connect, connection } from 'mongoose';
import { urlencoded } from 'body-parser';
import verify from './middleware/tokenVerification';

// Import routes
import generalRoutes from './routes/general.routes';
import authRoutes from './routes/auth.routes';
import adminRoutes from './administrator/route/admin.routes';

// Import middlewares
import loggerMiddleware from './middleware/logger.middleware';
import errorHandle from './middleware/error.middleware';

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

app.use(loggerMiddleware);
app.use(errorHandle);

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
