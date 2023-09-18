/* 
 * controller for performing CRUD on a user.
 */

/* import all neccessary modules & Libs*/
const User = require('../models/user/model');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const HttpStatus = require('http-status-codes');
const { createUserValidation, updateValidation, validate } = require("./validationMiddleware");
const saltRounds = 12;
const handleDatabaseError = (res, error) => {
	console.error(error);
	res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "internal server error" });
};

/* create user asynchronously */
exports.createUser = [
	createUserValidation,
	validate,
	async (req, res, next) => {
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

		const encrpytedPassword = await bycrypt.hash(password, saltRounds);

		const newUser = new User({ email, password: encryptedPassword });
		await newUser.save();
		/* return response */
		res.status(HttpStatus.CREATED).json({ message: "A new user is now created sucessfully" });
	}
		catch(error) {
			handleDatabaseError(res, error);
		}
	}
];
/**
 * create a functionto find list of all users and export it 
 * find all the list excluding the password cause its encrypted
 * do this asyncly
 * catch error
 * */
exports.findAllusers = async (req, res) => {
	try {
		const users = await User.find({}, "-password");
		res.status(HttpStatus.OK).json(users);
	}
	catch (error) {
		handleDatabaseError(res, error);
	}
};
/* find specific user */
exports.findUser = async(req, res) => {
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
		handleDatabaseError(res, error);
	}
};
/*update user*/
exports.updateUser = [
	updateUserValidation,
	validate
	async(req, res) => {
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
			const encryptedPassword = await bycrypt.hash(password, saltRounds);
			user.password = encryptePassword;
		}
		await user.save()
		res.status(HttpStatus.OK).json({ message: "user update successful" });
	}
	catch(error) {
		handleDatabaseError(res, error);
	}
	}
]
/* Delete user */
exports.deleteUser async (req, res) => {
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
		handleDatabaseError(res, error);
		}
};
