const redis = require("redis");
const { promisify } = require("util");
//import redis from "redis";
//import { promisify } from util;

/* class for redis service operations */

class redisClient {
  constructor() {

    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client); // create connection with redis
  

    /* check error in connection */
    this.client.on("error", (error) => {

    console.log("Redis client not connected to server");
    });


    /* check for successful connection */
    this.client.on("connect", () => {

      console.log("Redis clinet connected to the server");

      });
  } 


  /**
  * check if connection to Redis is Alive
  * @return {boolean}
  */
  isAlive() {

    return this.client.connected;
  }


  /**
  * get value corresponding to key in redis */

  async get(key)
  {
    const value = await this.getAsync(key);
    return value;
  }

  /**
  * creates a new key in redis with a TTl
  * @key {string} key to be saved in redis
  * @value {string} value to be assigned to key
  * @duration {number} TTl of key
  * @return {undefined} 
  */
  async set(key, value, duration)
  {
    this.client.setex(key, duration, value);
  }

  /* deletes key in redis service */
  async del(key)
  {
    this.client.del(key);
  }
}
redisClient = new redisClient();
module.exports = redisClient;
