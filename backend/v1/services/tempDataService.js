const { receiveMessageOnPort } = require("worker_threads");
const { redisClient } = require("../libs/boot.js");
const { logger } = require("../middleware/logger.js");
const redisManager = require("../services/caching.js");
const crypto = require("crypto");

class TempDataService {
  constructor() {
    this.hashed = "google_oauth:";
    this.GOOGLE_CACHE_EXPIRATION_TIME = 300;
    this.emailIndexPrefix = "google_oauth:email_index:";
  }

  generateUUID() {
    return crypto.randomUUID();
  }

  getHash(uuid) {
    return `${this.hashed}${uuid}`;
  }

  getEmailKey(email) {
    return `${this.emailIndexPrefix}${email}`;
  }

  async storeGoogleData(googleData) {
    try {
      const uuid = this.generateUUID();
      const hash = this.getHash(uuid);
      const email = googleData.email?.toLowerCase();

      // Prepare data
      const dataToStore = {
        ...googleData,
        email: email,
      };

      const multi = (await redisClient).multi();

      multi.hSet(hash, uuid, dataToStore);
      multi.expire(hash, this.GOOGLE_CACHE_EXPIRATION_TIME);

      // 2. Store the index (Map email -> uuid)
      if (email) {
        multi.set(
          this.getEmailKey(email),
          uuid,
          "EX",
          this.GOOGLE_CACHE_EXPIRATION_TIME,
        );
      }

      await multi.exec();

      return uuid;
    } catch (error) {
      logger.error("Error storing Google data:", error);
      throw error;
    }
  }

  async retrieveAndDeleteData(uuid) {
    const hash = this.getHash(uuid);

    // Get the data
    const data = await redisManager.cacheGet(hash, uuid);
    if (!data) {
      return null;
    }

    // Delete the data from Redis (used once)
    await redisManager.cacheDelete(hash, uuid);

    return data;
  }

  async findByEmail(email) {
    try {
      if (!email) {
        return null;
      }

      const emailKey = this.getEmailKey(email.toLowerCase());

      // Get the UUID associated with this email
      const uuid = await (await redisClient).get(emailKey);

      if (!uuid) {
        return null;
      }

      // extend ttl for both the hash and the email index
      await this.extendTTL(uuid, email);

      return uuid;
    } catch (error) {
      logger.error("Error finding temp data by email:", error);
      return null;
    }
  }

  async extendTTL(uuid, email, additionalSeconds = 300) {
    const hash = this.getHash(uuid);

    const remainingTTL = await (await redisClient).ttl(hash);
    if (remainingTTL > 0 && remainingTTL < 50) {
      const multi = (await redisClient).multi();

      // increase the ttl for the hash and secondary index (email -> uuid)
      multi.expire(hash, additionalSeconds);
      multi.expire(this.getEmailKey(email), additionalSeconds);
      await multi.exec();
      return true;
    }
    return false;
  }
}

const tempDataService = new TempDataService();
module.exports = tempDataService;
