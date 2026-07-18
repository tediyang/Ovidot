const { redisClient } = require('../libs/boot.js');
const { logger } = require('../middleware/logger.js');
// Default constant for cache expiration time in seconds (20 days).

class RedisManager {
  constructor() {
    this.CACHE_EXPIRATION_TIME = 20 * 86400;
  }

  /**
   * Deletes the cache data for a specific key in a hash.
   *
   * @param {string} hash - The hash name.
   * @param {string} key - The key to delete.
   * @return {undefined} Returns nothing.
   */
  async cacheDel(hash, key) {
    try {
      (await redisClient).hDel(hash, key);

      return;
    } catch (err) {
      logger.error(err);
      return;
    }
  };

  /**
   * Sets a value in the cache with the given hash, key, and value.
   *
   * @param {string} hash - The hash to set the value in.
   * @param {string} key - The key to set the value with.
   * @param {any} value - The value to set in the cache.
   * @return {undefined} Returns undefined.
   */
  async cacheSet(hash, key, value) {
    try {
      await Promise.all([
        (await redisClient).hSet(hash, key, value),
        (await redisClient).expire(hash, this.CACHE_EXPIRATION_TIME)
      ]);
      return;
    } catch (err) {
      logger.error(err);
      return;
    }
  };

  /**
   * Retrieves the value associated with a given key in a hash stored in the cache.
   *
   * @param {string} hash - The name of the hash.
   * @param {string} key - The key to retrieve the value for.
   * @returns {Promise<string>} A Promise that resolves with the value associated with the key.
   */
  async cacheGet (hash, key) {
    try {
      const data = await (await redisClient).hGet(hash, key);
      return data;
    } catch(err) {
      logger.error(err);
      return;
    }
  }
};


const redisManager = new RedisManager();
module.exports = redisManager;
