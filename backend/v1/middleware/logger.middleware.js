// logger.middleware.js
import { createWriteStream } from 'fs';
import { join } from 'path';

// Create a writable stream to log requests and responses to a file
const logStream = createWriteStream(join(__dirname, 'access.log'), { flags: 'a' });

// Custom logger middleware
const loggerMiddleware = (req, res, next) => {
  // Log the request method, URL, and timestamp
  const logEntry = `${new Date().toISOString()} - ${req.method} ${req.url}`;

  // Write the log entry to the access.log file
  logStream.write(logEntry + '\n');

  // Continue processing the request
  next();
};

export default loggerMiddleware;
