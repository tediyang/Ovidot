const redisClient = require("./redis");
const dbClient = require("./db");

/* user utilities */
const userUtils = {
  /**
   * get a user id and key from redis req
   * @req {req_obj}
   * @return{oject= userId:key}
   */

  async getUserIdAndKey(req) {
    const obj = {userId: null, key: null};
    const xToken = request.header("x-Token");
    if (!xToken)
      return obj;


    obj.key = `auth_${xToken}`;
    obj.userId = await redisClient.get(obj.key);
    return obj;
  },

  /**
   * get user from db
   * @query {obj} expression to finding user
   * @return {obj} user doc
   */
  async getUser(query) {
    const user = await dbClient.userCollection.fineOne(query);
    return user;
  },
};

module.exports = userUtils;
