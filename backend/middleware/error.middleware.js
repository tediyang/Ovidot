// error.middleware.js

function errorHandler(err, req, res, next) {
  // Your error handling logic here
  res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = errorHandler;
