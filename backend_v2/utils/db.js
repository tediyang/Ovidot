const mongoose = require("mongoose");
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 27017;
const DB = process.env.DB || "test";
const uri = `mongodb://${HOST}:${PORT}/${DB}`;
const User = require('../models/user.model'); // Assuming these are Mongoose models
const Cycle = require('../models/cycle.model'); // Assuming these are Mongoose models

class DBClient {
  constructor() {
    this.initialize();
  }

  async initialize() {
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      this.db = mongoose.connection;
      this.userCollection = User;
      this.cycleCollection = Cycle;
    } catch (error) {
      console.log("Error connecting to MongoDB:", error);
      this.db = null;
    }
  }

  isAlive() {
    return Boolean(this.db);
  }

  /* return the number of docs in users collection */
  async nbUsers() {
    if (!this.db) {
      throw new Error("DB connection not established.");
    }

    try {
      const numberOfUsers = await this.userCollection.countDocuments();
      return numberOfUsers;
    } catch (error) {
      console.error("Error counting users:", error);
      throw error;
    }
  }

  async nbCycle() {
    if (!this.db) {
      throw new Error("DB connection not established.");
    }
    try {
      const numberOfCycles = await this.cycleCollection.countDocuments();
      return numberOfCycles;
    } catch (error) {
      console.error("Error counting cycles:", error);
      throw error;
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
