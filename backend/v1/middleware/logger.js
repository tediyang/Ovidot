
import { createLogger } from 'winston';
import { transports, format } from 'winston';
import expressWinston from 'express-winston';

/**
 * Default log level.
 * @constant {string}
 */
const LOG_LEVEL = 'info';

/**
 * Default log file name.
 * @constant {string}
 */
const LOG_FILENAME = 'v1/logs/app.log';

/**
 * Default error log file name.
 * @constant {string}
 */
const ERROR_LOG_FILENAME = 'v1/logs/errors.log';

/**
 * Flag to handle exceptions in logs.
 * @constant {boolean}
 */
const LOG_EXCEPTIONS = true;

/**
 * Format for logging messages.
 * @constant {Object}
 */
const myFormat = format.printf(({ level, meta, message, timestamp }) => {
  return `${timestamp} ${level.toUpperCase()}: ${message} ${meta ? JSON.stringify(meta.res.statusCode) : ''}`;
});

/**
 * Logger instance for the application.
 * @type {winston.Logger}
 */
export const logger = createLogger({
  level: LOG_LEVEL,
  format: format.combine(
    format.json(),
    format.timestamp(),
    myFormat,
  ),
  transports: [
    /**
     * File transport for general logs.
     * @type {winston.transports.FileTransportInstance}
     */
    new transports.File({
      level: LOG_LEVEL,
      filename: LOG_FILENAME
    }),
    /**
     * File transport for error logs.
     * @type {winston.transports.FileTransportInstance}
     */
    new transports.File({
      level: 'error',
      filename: ERROR_LOG_FILENAME,
      handleExceptions: LOG_EXCEPTIONS
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  /**
   * Console transport for non-production environments.
   * @type {winston.transports.ConsoleTransportInstance}
   */
  logger.add(new transports.Console({
    handleExceptions: LOG_EXCEPTIONS
  }));
}

/**
 * Logger instance for Express application.
 * @type {expressWinston.logger}
 */
export const appLogger = expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  statusLevels: true,
  colorize: false, // To prevent ANSI codes in log message
  expressFormat: true,
});
