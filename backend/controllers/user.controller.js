/**
 * controller for performing CRUD on a user.
 */

/* import all neccessary modules & Libs*/
const User = require('../models/user.model');
const handleResponse = require('../utility/handle.response');
const HttpStatus =  require('httpstatus');

/**
 * 
 * @param {Object} data - user data
 * @returns
 */
exports.create = async(data) => {
	// create a user
	const email = data.email
	const existUser = await User.findOne({ email });
  	if (existUser) {
    	return handleResponse(res, HttpStatus.NOT_FOUND, `${email} already exist.`);
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
      	return handleResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
  	}
}

/**
 * Find the user and update the data passed.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns - updated user object
 */
exports.update = async(req, res, next) => {
	// get userId from params
	const userId = req.params.userId;
    const { username, age } = req.body;

	try {
		const updatedAt = new Date();
		const user = await User.findByIdAndUpdate(userId,
            {username: username, age: age, updated_at: updatedAt},
			{new: true});

		/* check for conditons */
		if(!user) {
			return handleResponse(res, HttpStatus.NOT_FOUND, "User not found");
		}
		// else return OK response
		res.status(HttpStatus.OK).json(user);
	}
	catch(error) {
		console.log(error);
		return handleResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
	}
}

/**
 * Fetch and return the user data from the database.
 * @param {Object} res
 * @param {Object} req
 * @param {Function} next
 * @returns -  the user data.
 */
exports.fetch = async (res, req, next) => {
	const userId = req.params.userId;

	try {
		const user = await User.findById(userId);
	
		return res.status(HttpStatus.OK).json({
			userId: user.id,
			username: user.username,
			age: user.age
		});

	} catch(error) {
		console.log(error);
		return handleResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
	}
}
