const Express = require('express');
const { logger } = require('../middleware/logger.js');
const { schedule } = require('node-cron');
const email_service = require('../services/emailService.js');
const { createClient } = require('redis');
const { readFileSync } = require('fs');
require('dotenv').config();

// Get environment variables
const {
  HOST,
  ENVIR,
  APP_PORT,
  USERNAME,
  PASSWORD,
  REDISPORT,
  PRIKEY,
  CRT,
  PEMFILE
} = process.env;


const redisSetup = async () => {
  let client;
  // Setup and connect to Redis Server
  if (ENVIR !== 'test' && ENVIR !== 'dev') {
    client = await createClient({
      username: `${USERNAME}`,
      password: `${PASSWORD}`,
      socket: {
        host: HOST,
        port: REDISPORT,
        tls: true,
        key: readFileSync(`./${PRIKEY}`),
        cert: readFileSync(`./${CRT}`),
        ca: [readFileSync(`./${PEMFILE}`)],
        reconnectStrategy: retries => {
          if (retries > 10) return new Error('Max reconnection attempts exceeded');
          return Math.min(retries * 50, 2000);
        },
      },
    })
      .on('success', () => logger.info(`Redis Client connected on port ${REDISPORT}`))
      .on('error', err => logger.error('Redis Client Error', err))
      .connect();
  
  } else {
    client = await createClient({
      socket: {
        reconnectStrategy: retries => {
          if (retries > 10) {
            logger.error('Max reconnection attempts exceeded');
            return new Error('Max reconnection attempts exceeded');
          }
  
          return Math.min(retries * 50, 2000);
        },
      },
    })
      .on('connect', () => logger.info('Redis Client connected on PORT 6379'))
      .on('error', err => logger.error('Redis Client Error', err))
      .connect();
  }

  return client;
}

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
