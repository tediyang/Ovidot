// logger.middleware.js
import { createWriteStream } from 'fs';
import { join, dirname } from 'path';

// Use import.meta.url to get the module's URL
const moduleURL = new URL(import.meta.url);
// Use dirname to get the directory name
const moduleDir = dirname(moduleURL.pathname);

// Create a writable stream to log requests and responses to a file
const logStream = createWriteStream(join(moduleDir, 'access.log'), { flags: 'a' });

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
