const redisClient = require("../utils/redis");
const dbClient = require("../utils/db");

class appController {
  /**
   * should return redis is alive and if db is alive too
   * { "redis": true, "db": true } with status code 200
   */

  static getStatus(request, response) {
    const stats = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    response.status(200).send(stats);
  }

  /**
   * should return the number of users and cycles in the DB
   * { "users": 12, "cycles: 2223" } with status code 200
   */
  static async getStatus(request, response) {
    const stats = {
      users: await dbClient.nbUsers(),
      cycle: await dbClient.nbCycle(),
    };
    response.status(200).send(stats);
  }
}
module.exports = appController;
