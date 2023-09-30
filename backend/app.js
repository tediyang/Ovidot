require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Import routes
const authRoute = require('./routes/auth.route');
const cycleRoute = require('./routes/cycle.route');
const userRoute = require('./routes/user.route');
const passRoute = require('./routes/password.route');
const adminRoute = require('./administrator/route/admin.route');

// Import middlewares
const loggerMiddleware = require('./middleware/logger.middleware');
const errorHandle = require('./middleware/error.middleware');

// start app
const app = express();
const { HOST, DB, PORT } = process.env;

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

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/password', passRoute); // Forgot password route
app.use('/api/cycles', cycleRoute);
app.use('/admin', adminRoute);

app.use(loggerMiddleware);
app.use(errorHandle);

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
