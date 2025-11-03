// const { fileURLToPath } = require('url');
const { join } = require('path');
const mongoose = require('mongoose');
const userSchema = require('../schemas/user.model.js');
const cycleSchema = require('../schemas/cycle.model.js');
const emailSchema = require('../schemas/email.model.js');
const adminSchema = require('../../admin/model/admin.model.js');
const { Collections } = require('../../enums.js');
const { logger } = require('../../middleware/logger.js');
const fs = require('fs').promises;
require('dotenv').config();

const db_name = process.env.DB_TEST;
// const db_user = process.env.DB_TEST_USER;
// const db_pwd = process.env.DB_TEST_URI_PWD;
const db_host = process.env.DB_TEST_HOST;
const db_port = process.env.DB_TEST_PORT;


class DbStorage {
  /**
   * Initializes a new instance of the DbStorage class.
   * 
   * This constructor establishes a connection to the MongoDB database using the provided credentials.
   * It also sets up the necessary variables and files for the DbStorage instance.
   *
   * @throws {Error} If the database connection fails.
   */
  constructor() {
    try {
      this._page_size = 20;

      // initializes a new DbStorage instance
      if (process.env.ENVIR === "test" || process.env.ENVIR === "dev") {
        this._conn = mongoose.createConnection(`mongodb://${db_host}:${db_port}/${db_name}`, {minPoolSize: 2});
      }
      else {
        this._conn = mongoose.createConnection(process.env.MONGO_URL, {minPoolSize: 2});
      }
      this._conn.once('open', () => {
        logger.info('Database connection successfully');
      });

      this._mongo_db = mongoose;
      this.mongo_repos = {};
      this._blacklist_file = join(__dirname, 'blacklist.json');

    } catch (error) {
      logger.error('Database connection failed');
      throw error;
    }
  }

  /**
   * Getter for the mongo_db property.
   *
   * @return {Object} The value of the mongo_db property.
   */
  get mongo_db() {
    return this._mongo_db;
  }

  /**
   * Getter for the page_size property.
   *
   * @return {number} The value of the page_size property.
   */
  get page_size() {
    return this._page_size;
  }

  /**
   * Set the value of the mongo_db property.
   *
   * @param {Object} value - The new value for the mongo_db property.
   */  
  set mongo_db(value) {
    this._mongo_db = value;
  }

  /**
   * Getter for the connection property.
   *
   * @return {Object} The value of the connection property.
   */
  get conn() {
    return this._conn;
  }

  /**
   * Retrieves a repository based on the provided key.
   *
   * @param {string} key - The key used to identify the repository.
   * @return {any} The repository associated with the provided key.
   * @throws {mongoose.Error} If the repository with the provided key does not exist in the database.
   */
  get_a_repo (key) {
    if (key in this.mongo_repos) {
      return this.mongo_repos[key]; 
    }
    else {
      logger.error(`Collection ${key} not in db`);
      throw Error(`${key} collection not in db`);
    }
  }

  /**
   * Closes the connection to the database.
   *
   * @return {Promise<void>} - A Promise that resolves when the connection is successfully closed.
   */
  async close_connection () {
    try {
      await this._conn.close()
      logger.info('Database connection closed', new Date().getTime());
    } catch (error) {
      logger.error(`Error closing database connection: ${error}`, new Date().getTime());
      throw error;
    }
  }

  /**
   * Reloads the models and collects the repositories for the current instance of the class.
   *
   * @throws {Error} - If there is an error while setting the models or collecting the repositories.
   */
  reload() {
    try {
      // set models
      const User = this._conn.model(Collections.User, userSchema);
      const Cycle = this._conn.model(Collections.Cycle, cycleSchema);
      const Email = this._conn.model(Collections.Email, emailSchema);
      const Admin = this._conn.model(Collections.Admin, adminSchema);
      

      // collect repos
      this.mongo_repos.User = User;
      this.mongo_repos.Cycle = Cycle;
      this.mongo_repos.Email = Email;
      this.mongo_repos.Admin = Admin;
    } catch (error) {
      logger.error(`Error while setting models: ${error}`);
      throw error;
    }
  }

  /**
   * Asynchronously adds a JWT object to the blacklist.
   *
   * @param {Object} jwtObj - The JWT object to be blacklisted.
   * @return {Promise<void>} - A promise that resolves when the JWT is successfully blacklisted.
   * @throws {Error} - If there is an error reading or writing the blacklist file.
   */
  async blacklist_jwt(jwtObj) {
    try {
      // Read data from blacklist.json
      const data = await fs.readFile(this._blacklist_file, 'utf8');
      let jsonData;
      if (!data) {
        jsonData = {
          jwts: [],
        };
      } else {
        jsonData = JSON.parse(data);
      }
  
      jsonData.jwts.push(jwtObj);
  
      const updatedData = JSON.stringify(jsonData, null, 2);

      await fs.writeFile(this._blacklist_file, updatedData, 'utf8');
  
      logger.info('jwt blacklisted');
      
    } catch (error) {
      logger.error(`Token not blacklisted: ${error}`);
      throw error;
    }
  }

  /**
   * Retrieves a JSON Web Token (JWT) from the given token.
   *
   * @param {string} token - The JWT token to retrieve.
   * @return {Object|null} The JWT object if found, or null if not found.
   */
  async get_jwt(token) {
    try {
      const jsonData = await fs.readFile(this._blacklist_file, 'utf8');
      if (!jsonData) {
        return null;
      }
      const jwt = JSON.parse(jsonData).jwts.find((j) => j.token === token);
      return jwt;
    } catch (error) {
      logger.error(`Couldn't fetch jwt: ${error}`);
      return null;
    }
  }
}


const db_storage = new DbStorage();
db_storage.reload(); // load Collections


/**
 * Returns information about pagination for a given filter and collection.
 * @param {object} filter - The filter to apply to the collection.
 * @param {string|null} collection - The name of the collection to query. If null, the function returns null.
 * @param {number} page_size - The number of items per page.
 * @param {number} page - The current page number.
 * @param {array|null} documents - The documents to paginate. If null, the function returns null.
 * @returns {object} - An object containing pagination information, haveNextPage, currentPageExists, totalPages and null if collection does not exist.
 * @throws {Error} - If there is an error while retrieving the pagination information.
 */
const page_info = async (filter={}, collection=null, page_size=10, page=1, documents=null) => {
  try {
    if(collection && Object.values(Collections).includes(collection)) {
      const totalCount = await db_storage.get_a_repo(collection).countDocuments(filter).exec();

      let totalPages = Math.floor(totalCount / page_size);
      if((totalCount % page_size) > 0) {
        totalPages = totalPages + 1;
      }

      return {
        haveNextPage: page < totalPages,
        currentPageExists: page <= totalPages,
        totalPages: totalPages
      };
    }

    if (documents) {
      let totalPages = Math.floor(documents.length / page_size);
      if((documents.length % page_size) > 0) {
        totalPages = totalPages + 1;
      }

      return {
        haveNextPage: page < totalPages,
        currentPageExists: page <= totalPages,
        totalPages: totalPages
      };
    }

    return null;
  } catch (error) {
    throw error;
  }
}


const { User, Cycle, Email, Admin } = db_storage.mongo_repos;

module.exports = { 
  storage: db_storage,
  MongooseError: db_storage.mongo_db.Error,
  Connection: db_storage.conn, 
  User,
  Cycle,
  Email,
  Admin,
  page_info,
};
