// Import dependencies and load the .env file 
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const auth = require('./routes/auth.route');

// fetch the env variables
const host = process.env.HOST || '127.0.0.1';
const db_env = process.env.DB || 'test';
const port = process.env.PORT || 5000;

// Connect with MongoDB
mongoose.connect(`mongodb://${host}/${db_env}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// start application
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', auth);  // Use the route for authentication


app.listen(port, () => {
    console.log(`listen on ${port}`);
})
