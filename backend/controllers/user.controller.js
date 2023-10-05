// USER CONTROLLER (CRUD)
const User = require('../models/user.model');
const { handleResponse } = require('../utility/handle.response');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

/**
 * create the user object for the new user if it doesn't exist
 * @data - user data passed used for creating a user.
 * @returns
 */
exports.create = async(data, res) => {
	// create a user
	const email = data.email
	const existUser = await User.findOne({ email });
  	if (existUser) {
    	return handleResponse(res, 404, `${email} already exist.`);
  	}

  	try {
    	const saltRounds = 12;
    	const salt = await bcrypt.genSalt(saltRounds);
    	// Hash the password
    	const hashedPassword = await bcrypt.hash(data.password, salt);
		data.password = hashedPassword;
    	// Register the new user data. The create method prevents sql injection
      	const newUser = await User.create(data);

      	await newUser.save();
      	return res.status(201).send();

  	} catch (error) {
    	console.error(error);
      	return handleResponse(res, 500, 'Internal Server Error');
  	}
}

/**
 * Find the user and update the data passed.
 * @returns - updated user object
 */
exports.update = async(req, res) => {
	// get userId from params
	try {
		const userId = req.user.id;
		const { username, age } = req.body;

		if (!username && !age) {
			return handleResponse(res, 400, "Provide atleast a param to update: username or age");
		}

		const updatedAt = new Date();
		const user = await User.findByIdAndUpdate(userId,
            {username: username, age: age, updated_at: updatedAt},
			{new: true});

		/* check for conditons */
		if(!user) {
			return handleResponse(res, 404, "User not found");
		}
		// else return OK response
		res.status(200).json({
			userId: user._id,
			email: user.email,
			username: user.username,
			age: user.age,
			cycles: user._cycles
		});
	}
	catch(error) {
		console.log(error);
		return handleResponse(res, 500, "Internal server error");
	}
}

/**
 * Fetch and return the user data from the database.
 * @param {Object} req - request from user
 * @param {Object} res - response set to user
 * @returns -  the user data.
 */
exports.fetch = async(req, res) => {
	try {
		const userId = req.user.id;
		const user = await User.findById(userId);

		/* check for conditons */
		if(!user) {
			return handleResponse(res, 404, "User not found");
		}

		return res.status(200).json({
			userId: user._id,
			email: user.email,
			username: user.username,
			age: user.age,
			cycles: user._cycles
		});

	} catch(error) {
		console.log(error);
		return handleResponse(res, 500, "Internal server error");
	}
}

/**
 * Delete the user data from the database.
 * @param {Object} res - response sent to user
 * @param {Object} req - request from user
 * @returns - None.
 */
exports.delete = async(req, res) => {
	try {
		const userId = req.user.id;
		const user = await User.findByIdAndDelete(userId);
		if (!user) {
			return handleResponse(res, 404, "User not found");
		}
		return res.status(204).send();
	} catch (error) {
		console.error(error);
		handleResponse(res, 500, "Internal server error");
	}
}
