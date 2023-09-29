// logger.middleware.js
const fs = require('fs');
const path = require('path');

// Create a writable stream to log requests and responses to a file
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Custom logger middleware
const loggerMiddleware = (req, res, next) => {
  // Log the request method, URL, and timestamp
  const logEntry = `${new Date().toISOString()} - ${req.method} ${req.url}`;

  // Write the log entry to the access.log file
  logStream.write(logEntry + '\n');

  // Continue processing the request
  next();
};

module.exports = loggerMiddleware;
