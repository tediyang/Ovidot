const userUtils = require("../utils/user");
const dbClient = require("../utils/db");

class CycleController {
  /**
   * Create a new cycle for a user and store it in the Redis cache.
   *
   * To create a cycle, the user must provide cycle data including month, period, start date, etc.
   * If the data is missing or invalid, return an error with a status code 400.
   * The endpoint should associate the cycle with the user.
   * Store the newly created cycle in the Redis cache.
   * Return the newly created cycle with a status code 201.
   */
  static async createCycle(request, response) {
    try {
      const userId = await userUtils.getUserIdAndKey(request);
      /* Extract data from the request */
      const { month, period, start_date, days, ovulation, period_range, ovulation_range, unsafe_days } = request.body;
      /* create a new cycle doc associated with the user */
      const newCycle = new dbClient.cycleCollection({
        month,
        period,
        start_date,
        days,
        ovulation,
        period_range,
        ovulation_range,
        unsafe_days
      });

      /* save the cycle document to the db */
      await newCycle.save();

      /* store the newly created into redis for caching */
      const success = await cycleUtils.storeCycleDataInCache(userId, newCycle);
      if(!success) {
        return response.status(500).send({error: "Error storing cycle data"});
      }
      return response.status(201).send(newCycle);
    }
    catch (error) {
      return response.status(400).send({error: "Invalid cycle data"});
    }
  }

  /**
   * Retrieve a user's cycles from the Redis cache or the database.
   *
   * Get all cycles associated with the user. If cycles are found in the Redis cache, return them.
   * If not found in the cache, query the database to retrieve them and store them in the cache.
   * Return the cycles with a status code 200.
   * If there are no cycles, return an empty array with a status code 200.
   */

  static async getUserCycles(request, response) {
    try {
      const userId = await userUtils.getUserIdAndKey(request);
      /* retrieve user cycles from the redis Cache */
      const cachedCycles = await cycleUtils.getCycleDataFromCache(userId);

      if(cachedCycles) {
        return response.status(200).send(cachedCycles);
      }
      else {
        /* Query the db if not found */
        const userCycles = await dbClient.cycleCollection.find({userId});
        if (userCycles.length === 0) {
          return response.status(200).send([]);
        }

        /* store the user cycles in redis for cache */
        const success = await cycleUtils.storeCycleDataInCache(userId, userCycles);

        if (!success) {
          return response.status(500).send({error: "Error storing cycle data"});
        }

        return response.status(200).send(userCycles);
      }
    }
    catch(error) {
      return response.status(500).send({error: "Error retrieving cycles"});
    }
  }

  /**
   * update an existing cycle for a user and update it in the caching.
   * to update user much provide cycle data and specify the cycle to update by Id
   * if it does not exist it returns error 404
   * update the cycle in db and redis
   * return 200
   */
  static async updateCycle(request, response) {
    try {
      const userId = await userUtils.getUserIdAndKey(request);
      const {cycleId, month, period, start_date, days, ovulation, period_range, ovulation_range, unsafe_days} = request.body;
      const existingCycle = await dbClient.cycleCollection.findOne({_id: cycleId, userId});
      if(!existingCycle) {
        return response.status(404).send({error: "Cycle not found"});
      }
      existingCycle.month = month;
      existingCycle.period = period;
      existingCycle.start_date = start_date;
      existingCycle.days = days;
      existingCycle.ovulation = ovulation;
      existingCycle.period_range = period_range;
      existingCycle.ovulation_range = ovulation_range;
      existingCycle.unsafe_days = unsafe_days;

      await existingCycle.save();

      /*update too in cache */
      const success = await cycleUtils.updateCycleDataInCache(userId, existingCycle);
      if(!success) {
        return response.status(500).send({error: "error updating cycle data in cache"});
      }
      return response.status(200).send(existingCycle);
    }
    catch(error) {
      return response.status(400).send({error: "invalid cycle data"});
    }
  }
  /**
   * delete a cycle and remove it from cache.
   * the user must specify the cycle to delete by Id
   * if it does not exist return 404
   * Delete the cycle from db and remove from cache
   * return 204
   */
  static async deleteCycle(request, response) {
    try {
      const userId = await userUtils.getUserIdAndKey(request);
      const cycleId = request.params.cycleId;
      const existingCycle = await dbClient.cycleCollection.findOne({_id: cycleId, userId});
      if (!existingCycle) {
        return response.status(404).send({error: "cycle not found"});
      }
      await existingCycle.remove();
      const success = await cycleUtils.deleteCycleDataFromCache(userId, cycleId);
      if (!success) {
        return response.status(500).send({error: "Error in deleting data"});
      }
      retirn response.status(204).send();
    }
    catch (error) {
      return response.status(500.send({error: "error deleting cycle"});
    }
  }
}
module.exports = CycleController;
