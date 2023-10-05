// Import dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const verify = require('./middleware/tokenVerification');

// Import routes
const generalRoutes = require('./routes/general.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./administrator/route/admin.routes');

// Import middlewares
const loggerMiddleware = require('./middleware/logger.middleware');
const errorHandle = require('./middleware/error.middleware');

// start app
const app = express();
const { HOST, DB, PORT } = process.env;

// url path
const APP_PATH = '/api/v1';

// Connect to database
mongoose.connect(`mongodb://${HOST}/${DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 2
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connected!');
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// use routes
app.use(APP_PATH+'/auth', verify, authRoutes);
app.use(APP_PATH+'/admin', adminRoutes);
app.use(APP_PATH, generalRoutes);

app.use(loggerMiddleware);
app.use(errorHandle);

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
