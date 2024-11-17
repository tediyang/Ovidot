const { json } = require('express');
const cors = require('cors');
const morgan = require('morgan');

/**
 * Injects the neccesary malwares to the provided app
 * @param {Express} app
 */
const allowedOrigin = (app) => {
  const origin = process.env.ALLOWED_ORIGIN;
  
  // Enable cors
  app.use(cors({
    origin: origin,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // Include cookies in CORS requests
    optionsSuccessStatus: 204, // Respond with a 204 status for preflight requests
  }));

  // to parse request body as json
  app.use(json({ limit: '1000kb'}));

  // for logging requests details
  app.use(morgan('dev'));
};


module.exports = allowedOrigin;
