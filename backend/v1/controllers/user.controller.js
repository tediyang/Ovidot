// USER CONTROLLER (CRUD)
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { handleResponse } from '../utility/handle.response.js';

const { genSalt, hash } = bcrypt;

/**
 * Create the user object for the new user if it doesn't exist
 * @data - user data passed, used for creating a user.
 * @res - Express Response
 * @returns Payload on success
 */
export async function createUser(data, res) {
	// create a user
	const email = data.email
	const existUser = await User.findOne({ email });
  	if (existUser) {
    	return handleResponse(res, 404, `${email} already exist.`);
  	}

  	try {
    	const saltRounds = 12;
    	const salt = await genSalt(saltRounds);
    	// Hash the password
    	const hashedPassword = await hash(data.password, salt);
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
 * @param {Object} req - Express Request
 * @param {Object} res - Express Response
 * @returns - updated user object
 */
export async function updateUser(req, res) {
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
 * @param {Object} req - Express Request
 * @param {Object} res - Express Response
 * @returns -  the user data.
 */
export async function fetchUser(req, res) {
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
 * @returns - Payload on Success
 */
export async function deleteUser(req, res) {
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
};
