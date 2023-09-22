require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const auth = require('./routes/auth.route');
const cycle = require('./routes/cycle.route');

app.use(cors());
app.use(express.json());

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

// start application
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', auth);  // Route for signup and login authentication
app.use('/api', cycle);  // route for CRUD operation on cycle

const errorHandler = require('./middleware/error.middleware.js');
app.use(errorHandler);

const loggerMiddleware = require('./middleware/logger.middleware.js');
app.use(loggerMiddleware);

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
