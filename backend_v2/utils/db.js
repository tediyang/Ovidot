const { MongoClient } = require("mongodb");

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 27017;
const DB = process.env.DB || "test";
const uri = `mongodb://${HOST}:${PORT}`;
const client = new MongoClient(uri, { useUnifiedTopology: true });


class DBClient {
  constructor() {
    this.initialize();
  }

  async initialize() {

    try { 
      const connectedClient = await client.connect();

      this.db = connectedClient.db(DB);
      this.userCollection = this.db.collection("users");
      this.cycleCollection = this.db.collection("cycles");
      }
      catch(error) {

        console.log("Error connecting to MongoDB:", error);

        this.db = false;
      }
  }

  isAlive() {
    return Boolean(this.db);
  }
  

  /* return the number of docs in users collection */
  async nbUsers() {
    const numberOfUsers = await this.userCollection.countDocuments();
    return numberOfUsers;
  }


  async nbCycle() {
    const numberOfCycles = await this.cycleCollection.countDocuments();
    return numberOfCycles;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
