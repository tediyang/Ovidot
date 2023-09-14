import { MongoClient } from "mongodb";
// setting the variables for connection
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_HOST || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'ovidot';
const url =  `mongodb://${DB_HOST}:${DB_PORT}`;


/* class to perform mongod services */
class DBClinet {
	constructor() {
		MongoClient.connect(url, {useUnifiedTopology: true }, (err, client) => {
			/**
			 * return connection successful if no error encounter
			 * then set the properties if successful
			 * else throw an error message
			 * set the properties to false
			 **/
			if (!err) {
				console.log("connection to server successful");
				this.db = client.db(DB_DATABASE);
				this.usercollection = this.db.collection('users');
				this.periodcollection = this.db.collection('period');
				this.ovulationcollection = this.db.collection('ovulation');
				this.pregnancycollection = this.db.collection('pregnant');
			}
			else {
				console.log(err.message);
				this.db = false;
			}
		});
	}

	/**
	 * this functions checks if connection is alive
	 * it returns true or false @Boolean
	 **/

	isAlive() {
		return Boolean(this.db);
	}
	
	/* returns the number of users doc */
	async nbUsers() {
		const numberOfUsers = this.usercollection.countDocuments();
		return numberOfUsers;
	}

	/* returns the number of docs in period collection */
	async nbPeriod() {
		const numberoFperiodcycles = this.periodcollection.countDocuments();
		return numberoFcycles;
	}

	/* returns the number of docs in ovulation */
	async nbOvulatio() {
		const numberoFovulation = this.ovulationcollection.countDocuments();
	}

	/* returns the number of pregnancy doc */
	async nbPregnancy() {
		const numberoFpregnancy = this.pregnancycollection.countDocuments();
	}

}
// create a new instance of the class
const dbClient = new DBClient();

export default dbClient;
