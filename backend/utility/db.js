const MongoClient = require("mongodb");

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 27017;
const DB = process.env.DB || "test";
const uri = `mongodb://${HOST}:${PORT}`;
const client = new MongoClient(uri, { useUnifiedTopology: true });


class DBClient {
  constructor () {
    client.connect(url,(err, client) => {
      if (!err) {
        this.db = client.db(DB);
        this.userCollection = this.db.collection("User");
        this.cycleCollection = this.db.collection("Cycle");
      }
      else {
        console.log(err.message);
        this.db = false;
      }
    });
  }

  isAlive() {
    return Boolean(this.db);
  }
  

  /* return the number of docs in users collection */
  async nbUsers() {
    const numberOfUsers = this.userCollection.countDocuments();
    return numberOfUsers;
  }


  async nbCycle() {
    const numberOfCycles = this.cycleCollection.countDocuments();
    return numberOfCycles;
  }
}

const dbClient = new DBClient();
module.export = dbClient;
