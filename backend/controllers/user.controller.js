/* 
 * controller for performing CRUD on a user.
 */

/* import all neccessary modules & Libs*/
const User = require('../models/user.model');
const req
// const HttpStatus = require('http-status-codes');
const { createUserValidation, updateValidation, validate } = require("./validationMiddleware");
const saltRounds = 12;
const { handleResponse } = require("./responseMiddleware");

/**
 * create a function to find list of all users and export it
 * find all the list excluding the password cause its encrypted
 * do this asyncly
 * catch error
 */
// exports.findAllusers = async (req, res) => {
// 	try {
// 		const users = await User.find({}, "-password");
// 		res.status(HttpStatus.OK).json(users);
// 	}
// 	catch (error) {
// 		return handleResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
//  }
// };

/* find specific user */
exports.update = async(req, res, next) => {
	//initialize userId
	const { userId } = req.params.id;
    const {period, pregnant, ovulation, datetime } = req.body;

	try {
		const user = await User.findByIdAndUpdate(userId,
            {});
		/* check for conditons */
		if(!user) {
			return handleResponse(res, HttpStatus.NOT_FOUND, "User not found");
		}
		// else return OK response
		res.status(HttpStatus.OK).json(user);
	}
	catch(error) {
		return handleResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
	}
};
/*update user*/
exports.updateUser = [
	updateUserValidation,
	validate
	async (req, res) => {
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
			return handleResponse(res, HttpStatus.NOT_FOUND, "User not found");
		}
		if (email) {
			user.email = email;
		}
		if(password) {
			const encryptedPassword = await bycrypt.hash(password, saltRounds);
			user.password = encryptePassword;
		}
		await user.save()
		return handleResponse(res, HttpStatus.OK, "User update successful");
	}
	catch(error) {
		return handleResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
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
			return handleResponse(res, HttpStatus.NOT_FOUND, "User not found");
		}
		/* else, delete it */
		// we need to have a log later on
		res.status(HttpStatus.OK).json({ message: "user deleted sucessfully" });
	}
	catch(error) {
		return handleResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
		}
};
