// USER CONTROLLER (CRUD)
const handleResponse = require('../utility/helpers/handle.response.js');
const notifications = require('../services/notifications.js');
const requestValidator = require('../utility/validators/requests.validator.js')
const { emailType } = require('../enums.js');
const util = require('../utility/encryption/cryptography.js')
const { Connection, Email, User, MongooseError } = require('../models/engine/database.js');
const { userAction, notificationStatus, userStatus } = require('../enums.js');
const { Types } = require('mongoose');
const Joi = require('joi');
const { JsonWebTokenError } = require('jsonwebtoken');
const blacklist = require('../middleware/tokenBlacklist.js');
require('dotenv').config();


class UserController {

	_EXCLUDE = process.env.EXCLUDE;
	/**
	 * Create the user object for the new user if it doesn't exist
	 * @res - Express Response
	 * @data - user data passed, used for creating a user.
	 * @returns Payload on success
	 */
	async createUser(res, data) {
		try {
			// check for existing user
			const existing_data = Promise.all([
				User.findOne({ email: data.email }),
				User.findOne({ phone: data.phone })
			])
	
			const [email, phone] = await existing_data
	
			if (email || phone) {
				if (email) {
					return handleResponse(res, 400, 'Email already exists');
				}	else {
					return handleResponse(res, 400, 'Phone already exists');
				}
			}
	
			// check for min age (8 years)
			const minDOB = new Date(); // minimum age
			const maxDOB = new Date(); // maximum age
			minDOB.setFullYear(minDOB.getFullYear() - 8);
			maxDOB.setFullYear(maxDOB.getFullYear() - 58);
			if (data.dob > minDOB) {
				return handleResponse(res, 400, 'You are too young to menstrate');
			}
			else if (data.dob < maxDOB) {
				return handleResponse(res, 400, 'You are above the menstrual age');
			}
	
			// create user
			const user = {
				name: {
					fname: data.fname,
					lname: data.lname
				},
				email: data.email,
				phone: data.phone,
				username: data.username,
				dob: data.dob,
				period: data.period
			};
	
			// encrypt user password
			const pwd = await util.encrypt(data.password);
			user.password = pwd;
	
			await Connection.transaction(async () => {
				const resoled_u = await User.create(user);
	
				// Send email
				await Email.create({
					email: user.email,
					username: user.username,
					email_type: emailType.welcome
				});
	
				// Generate notification
				const message = `${user.username}, your account has been created`;
				const notify = await notifications.generateNotification(userAction.createdUser, message);
	
				// Add the notification
				resoled_u.notificationsList.push(notify);
				await resoled_u.save();
			});
	
			return handleResponse(res, 201, "Registration Successful");
	
		} catch (error) {
			throw error;
		}
	};

	/**
	 * Find the user and update the data passed.
	 * @param {Object} req - Express Request
	 * @param {Object} res - Express Response
	 * @returns - updated user object
	 */
	async updateUser(req, res) {
		try {
			// validate user input
			const { value, error } = requestValidator.UpdateUser.validate(req.body);
	
			if (error) {
				throw error;
			};
	
			const minDOB = new Date();
			const maxDOB = new Date();
			minDOB.setFullYear(minDOB.getFullYear() - 8);
			maxDOB.setFullYear(maxDOB.getFullYear() - 58);
			if (value.dob > minDOB || value.dob < maxDOB) {
				return handleResponse(res, 400, 'You are too young or above the age to menstrate (min: 8 years, max: 58 years)');
			};

	
			const { fname, lname, dob, period, username, sensitive, password } = value;
	
			const user = await User.findById(req.user.id, this._EXCLUDE);
			if(!user) {
				return handleResponse(res, 404, "User not found");
			}
	
			// validates password for updating sensitive data
			if (sensitive) {
				const { phone, new_password } = sensitive;
				const is_pwd = await util.validate_encryption(password, user.password);
				// validate password
				if(!is_pwd) {
					return handleResponse(res, 400, "Invalid password");
				}

				if (phone) {
					user.phone = phone;
				}
				if (new_password) {
					user.password = await util.encrypt(new_password);
					user.jwtRefreshToken = ""; // reset refresh token
				}
			}
	
			if(fname) { user.name.fname = fname; }
			if(lname) { user.name.lname = lname; }
			if(dob) { user.dob = dob; }
			if(period) { user.period = period; }
			if(username) { user.username = username; }
	
			// Generate notification
			const message = 'Your profile has been updated';
			const notify = await notifications.generateNotification(userAction.updatedUser, message);
	
			// Add new notification
			user.notificationsList.push(notify);
	
			// manage noifications
			await notifications.manageNotification(user.notificationsList);
			await user.save();
	
			return res
				.status(200)
				.json({
					message: 'User succesfully updated',
					user: user,
				});
	
		} catch(error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof Joi.ValidationError) {
				return handleResponse(res, 400, error.details[0].message);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
			return handleResponse(res, 500, error.message, error)
		}
	}

	/**
	 * Fetch and return the user data from the database.
	 * @param {Object} req - Express Request
	 * @param {Object} res - Express Response
	 * @returns -  the user data.
	 */
	async fetchUser(req, res) {
		try {
			const user = await User.findById(req.user.id, this._EXCLUDE);
	
			if(!user) {
				return handleResponse(res, 404, "User not found");
			}
	
			return res.status(200).json({ user });
	
		} catch(error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
			return handleResponse(res, 500, error.message, error)
		}
	}


	/**
	 * Deactivate a user account.
	 * @param {Object} req - Express Request
	 * @param {Object} res - Express Response
	 * @returns {void}
	 * @throws {Object} - Error response object.
	 */
	async deactivateUser(req, res) {
		try {
			const user = await User.findById(req.user.id);
			if (!user) {
				return handleResponse(res, 404, "User not found");
			}
			
			user.status = userStatus.deactivated;

			await Connection.transaction(async () => {
				// Send termination email
				await Email.create({
					email: user.email,
					username: user.username,
					email_type: emailType.deactivate
				});

				// Generate notification
				const message = 'Your profile has been deactivated';
				const notify = await notifications.generateNotification(userAction.deactivatedUser, message);
		
				// Add new notification
				user.notificationsList.push(notify);

				// blacklist token
				blacklist.updateBlacklist(req.token);
				user.jwtRefreshToken = '';

				// manage noifications
				await notifications.manageNotification(user.notificationsList);
				await user.save();

			});
			return handleResponse(res, 204);
	
		} catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
			return handleResponse(res, 500, error.message, error);
		}
	};

	/**
	 * Delete the user data from the database.
	 * @param {Object} res - response sent to user
	 * @param {Object} req - request from user
	 * @returns - Payload on Success
	 */
	async deleteUser(req, res) {
		try {
			await Connection.transaction(async () => {
				const user = await User.findByIdAndDelete(req.user.id);
				if (!user) {
					throw new Error("User not found");
				}

				// blacklist token
				blacklist.updateBlacklist(req.token);

				// Send termination email
				await Email.create({
					email: user.email,
					username: user.username,
					email_type: emailType.delete
				});
			});
	
			return handleResponse(res, 204);
	
		} catch (error) {
			if (error.message === "User not found") {
				return handleResponse(res, 404, error.message);
			}
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
			return handleResponse(res, 500, error.message, error);
		}
	};

	/**
	 * Get a notification and mark it as read.
	 * @param {Object} req - Express request object.
	 * @param {Object} res - Express response object.
	 * @returns {Promise<Object>} A Promise that resolves to the updated notification.
	 * @throws {Object} If the user is not found, the notification is not found, or there is a Mongoose or JSON Web Token error.
	 */
  async getNotification(req, res) {
    try {
      if (!req.params.id) {
				return handleResponse(res, 400, 'Invalid request, id is required');
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return handleResponse(res, 404, 'User not found');
      };

      const note = user.notificationsList.id(new Types.ObjectId(req.params.id));
      if (!note) {
				return handleResponse(res, 404, 'Notification not found');
      }

			note.status = notificationStatus.read;

      await user.save();

      return res
        .status(200)
        .json({ note });

    } catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
			return handleResponse(res, 500, error.message, error)
		};
  }
	
	/**
	 * Get all the notifications of the user
	 * @param {Object} req - Express Request
	 * @param {Object} res - Express Response
	 * @return {Promise<void>}
	 */
	async getNotifications(req, res) {
		try {
			const user = await User.findById(req.user.id);
			if(!user) {
				return handleResponse(res, 404, "User not found")
			};

			return res
			.status(200)
			.json({
					notifications: user.notificationsList
				});
		} catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
			return handleResponse(res, 500, error.message, error)
		}
	}

	/**
	 * Delete a notification of the user
	 * @param {Object} req - Express Request
	 * @param {Object} res - Express Response
	 * @return {Promise<void>}
	 */
	async deleteNotification(req, res) {
		try {
			if (!req.params.id) {
				return handleResponse(res, 400, 'Invalid request, id is required');
			}

			const user = await User.findById(req.user.id);
			if (!user) {
				return handleResponse(res, 404, 'User not found');
			}

			const note = user.notificationsList.id(new Types.ObjectId(req.params.id));
			if (!note) {
				return handleResponse(res, 404, 'Notification not found');
			}

			user.notificationsList = user.notificationsList.filter(data => (data._id !== note._id));

			await user.save();

			return handleResponse(res, 204);

		} catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
			return handleResponse(res, 500, error.message, error)
		};
	}
}


const userController = new UserController();
module.exports = userController;
