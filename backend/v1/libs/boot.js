const { logger } = require('../middleware/logger.js');
const { createClient } = require('redis');
require('dotenv').config();

// Get environment variables
const {
  REDIS_URL,
  ENVIR
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

const redisClient = redisSetup();
module.exports = { redisClient };
