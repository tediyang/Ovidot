const redisClient = require("./redis");
const dbClient = require("./db");

/* user utilities */
const userUtils = {
  /**
   * get a user id and key from req
   * @req {req_obj}
   * @return {object} userId and key
   */
  async getUserIdAndKey(req) {
    const obj = { userId: null, key: null };
    const xToken = req.header("x-Token");
    if (!xToken) {
      return obj;
    }

    obj.key = `auth_${xToken}`;
    obj.userId = await redisClient.get(obj.key);
    return obj;
  },

  /**
   * get user from the database
   * @param {object} query - expression to find a user
   * @return {object} - user document
   */
  async getUser(query) {
    try {
      const user = await dbClient.userCollection.findOne(query).exec();
      return user;
    } catch (error) {
      console.error("Error fetching user", error);
      throw error;
    }
  },
};

module.exports = userUtils;
