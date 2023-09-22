const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
//require('dotenv-safe/config.js');
require('dotenv').config()
const app = express();

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

const routes = require('./routes/index.js');
app.use('/api', routes);

const errorHandler = require('./middleware/error.middleware.js');
app.use(errorHandler);

const loggerMiddleware = require('./middleware/logger.middleware.js');
app.use(loggerMiddleware);

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
