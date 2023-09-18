/* 
 * controller for performing CRUD on a user.
 */

/* import all neccessary modules & Libs*/
const User = require('../models/user/model');
const bcrypt = require('bycryptjs');
const { validationResult } = require('express-validator');
const HttpStatus = require('http-status-codes');

/* create user asynchronously */
exports.createUser = async (req, res, next) => {
	try {
		/**
		 * parse the email and password from the req.body
		 * check if email exist
		 * if it does throw an httpstatus code in a json format 
		 * encrypt the password 
		 * go ahead to create new user since checked not existing */
		const { email, password } = req.body;
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(HttpStatus.BAD_REQUEST).json({ message: "email exists?: yes!" });
		}

		const saltRounds = 12;
		const encrpytedPassword = await bycrypt.hash(password, saltRounds);

		const newUser = new User({ email, password: encryptedPassword });
		await newUser.save();
		/* return response */
		res.status(HttpStatus.CREATED).json({ message: "A new user is now created sucessfully" });
	}
};
/**
 * create a functionto find list of all users and export it 
 * find all the list excluding the password cause its encrypted
 * do this asyncly
 * catch error
 * */
exports.findAllusers = async (req, res, next) => {
	try {
		const users = await User.find({}, "-password");
		res.status(HttpStatus.OK).json(users);
	}
	catch (error) {
		console.error(error);
		res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "internal server error" });
	}
};
/* find specific user */
exports.findUser = async(req, res, next) => {
	//initialize userId
	const userId = req.params.id;
	try {
		const user = await User.findById(userId, "-password");
		/* check for conditons */
		if(!user) {
			return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found"});
		}
		// else return OK response
		res.status(HttpStatus.OK).json(user);
	}
	catch(error) {
		console.error(error);
		res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "internal server error" });
	}
};
/*update user*/
exports.updateUser = async(req, res, next) => {
	const userId = req.param.id;
	const { email, password } = req.body;
	try {
		/**
	 	* find user by Id
	 	* if it exist
	 	* then update users properties
	 	* encrypt the password
	 	* save the modification
	 	* ?
	 	* */
		if(!user) {
			return res.status(HttpStatus.NOT_FOUND).json({ message: "user not found" });
		}
		if (email) {
			user.email = email;
		}
		if(password) {
			const saltRounds = 12;
			const encryptedPassword = await bycrypt.hash(password, saltRounds);
			user.password = encryptePassword;
		}
		await user.save()
		res.status(HttpStatus.OK).json({ message: "user update successful" });
	}
	catch(error) {
		console.error(error);
		res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "internal server Error" });
	}
}
/* Delete user */
exports.deleteUser async (req, res, next) => {
	const userId = req.params.id;
	try {
		/* find and remove user by Id */
		const result = await User.findByIdAndRemove(usrId);
		if(!result) {
			return res.status(HttpStatus.NOT_FOUND).json({ message: "user not found" });
		}
		/* else, delete it */
		// we need to have a log later on
		res.status(HttpStatus.OK).json({ message: "user deleted sucessfully" });
	}
	catch(error) {
		console.error(error) {
			res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "internal server error" });
		}
	};
