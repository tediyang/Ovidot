const Express = require('express');
const { logger } = require('../middleware/logger.js');
const { schedule } = require('node-cron');
const email_service = require('../services/emailService.js');
const { createClient } = require('redis');
require('dotenv').config();

// Get environment variables
const {
  REDIS_URL,
  ENVIR,
  APP_PORT
} = process.env;


const redisSetup = async () => {
  let client;

  try {
    if (ENVIR === 'test' || ENVIR === 'dev') {
      // Local or test environment
      client = createClient({
        socket: {
          reconnectStrategy: retries => {
            if (retries > 3) {
              logger.error('Max reconnection attempts exceeded');
              return new Error('Max reconnection attempts exceeded');
            }
            return Math.min(retries * 50, 2000);
          },
        },
      });

      client.on('connect', () => logger.info('Redis Client connected on PORT 6379'));
    } else {
      // Production environment using Render's internal Redis
      client = createClient({
        url: REDIS_URL,
        socket: {
          reconnectStrategy: retries => {
            if (retries > 3) {
              logger.error('Max reconnection attempts exceeded');
              return new Error('Max reconnection attempts exceeded');
            }
            return Math.min(retries * 50, 2000);
          },
        },
      });

      client.on('connect', () => logger.info(`Redis Client connected to ${REDIS_URL}`));
    }
    client.on('error', err => logger.error('Redis Client Error', err));

    await client.connect(); // Connect the client
    return client;

  } catch (error) {
    logger.error('Redis setup failed', error);
  }
};

/**
 * Starts server
 * @param {Express} app
 */
const startServer = async (app) => {
  const port = APP_PORT || 5000;


  app.listen(port, () => {
    logger.info(`Server listening on PORT ${port}`);

    // Setup cron job
    if (process.env.EMAIL) {
      try {
        // Schedule the cron job
        schedule("*/20 * * * * *", async () => { await email_service.handleEmailCron() });

        // Log success message for the cron job
        logger.info('Mail job is active and scheduled to run every 30 seconds.');
      } catch (error) {
        // Log failure message if scheduling the cron job fails
        logger.error('Mail job setup failed: ', error);
      }
    } else {
      logger.info('No MAIL_USER specified, cron job not scheduled.');
    }
  });
};


const redisClient = redisSetup();
module.exports = { startServer, redisClient };
