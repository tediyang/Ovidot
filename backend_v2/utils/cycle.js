const redisClient = require("./redis");
const dbClient = require("./db");

const cycleUtils = {
  /**
   * get cycle data for a usr from redis cache.
   * @param {string} userId
   * @return {obj|null} null if not found
   */

  async getCycleDataFromCache(userId) {
    const key = `cycle_${userId}`;
    const cycleData = await redisClient.get(key);
    return cycleData ? JSON.parse(cycleData) : null;
  },

  /**
   * store cycle data for a user in redis cache
   * @param {string} userId
   * @param {obj} cycleData
   * @param {number} duration TTL
   * @return {boolean} true if stored successfully else false
   */

  async storeCycleDataInCache(userId cycleData, duration) {
    const key = `cycle_${userId}`;
    const cycleDataString = JSON.stringify(cycleData);
    return await redisClient.set(key, cycleDataString, duration);
  },

  /**
   * get cycle data for a user from the db
   * @param {object} query to find cycle data
   * @return {obj|null}
   */
  async getCycleDataFromDb(query) {
    try {
      return await dbClient.cycleCollection.findOne(query).exec();
    }
    catch (error) {
      console.error("error fetching cycle data from db", error);
      throw error;
    }
  },
};
module.exports = cycleUtils;
