require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRoute = require('./routes/auth.route');
const cycleRoute = require('./routes/cycle.route');
const userRoute = require('./routes/user.route');
const passRoute = require('./routes/password.route');

const loggerMiddleware = require('./middleware/logger.middleware');
const errorHandle = require('./middleware/error.middleware');

const app = express();
const { HOST, DB, PORT } = process.env;

mongoose.connect(`mongodb://${HOST}/${DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connected!');
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api', cycleRoute);
app.use('/api/users', userRoute);
app.use('/api', passRoute); // Forgot password route

app.use(loggerMiddleware);
app.use(errorHandle);

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
