// REGISTER CONTROLLER
const { User, MongooseError } = require('../models/engine/database.js');
const { sign, JsonWebTokenError } = require('jsonwebtoken');
const { compare } = require('bcrypt');
const { PATH_PREFIX } = require('../swagger-docs')
const userController = require('./user.controller.js');
const handleResponse = require('../utility/helpers/handle.response.js');
const blacklist = require('../middleware/tokenBlacklist.js');
const requestValidator = require('../utility/validators/requests.validator.js');
const { userStatus } = require('../enums.js');
const Joi = require('joi');
require('dotenv').config();

// Secret key for jwt signing and verification
const secretKey = process.env.SECRETKEY;


class AppController {
  /**
   * Generate token for user. Expiration 5hrs
   * @param {User} user - User object to generate token for
   */
  createToken(user) {
    return sign({ id: user._id, email: user.email, status: user.status }, secretKey, { expiresIn: '5h' });
  };

  /**
   * Register user
   * @param {Object} req - Express Request
   * @param {Object} res - Express Response
   * @return Payload on Success
   */
  async signup(req, res) {
    // Validate the user input
    try {
      // validate body
      const { value, error } = requestValidator.Signup.validate(req.body);

      if (error) {
        throw error;
      }

      return await userController.createUser(res, {...value});

    } catch (error) {
      if (error instanceof MongooseError) {
        return handleResponse(res, 500, "We have a mongoose problem", error);
      }
      if (error instanceof JsonWebTokenError) {
        return handleResponse(res, 500, error.message, error);
      }
      if (error instanceof Joi.ValidationError) {
        return handleResponse(res, 400, error.details[0].message);
      }
      return handleResponse(res, 500, error.message, error)
    }
  };

  /**
   * Login user
   * @param {Object} req - Express Request
   * @param {Object} res - Express Response
   * @return Payload on Success
   */
  async login(req, res) {
    try {
      const { value, error } = requestValidator.Login.validate(req.body);

      if (error) {
        throw error;
      }

      // validate email/username
      const [ phone, email ] = await Promise.all(
        [
          User.findOne({ phone: value.email_or_phone }),
          User.findOne({ email: value.email_or_phone })
        ]
      );
      const user = phone || email;
      if (!user) {
        return handleResponse(res, 400, "email, phone or password incorrect");
      }
    
      if (userStatus.deactivated == user.status) {
        const resolve = `Account deactivated - resolve with: ${PATH_PREFIX}/general/forget-password`;
        return handleResponse(res, 400, resolve);
      }

      // validate password
      const matched = await compare(value.password, user.password);

      if (!matched) {        
        if (user.loginAttempts >= 5) {
          user.status = userStatus.deactivated;
          await user.save();
          const resolve = `Account deactivated - resolve with: ${PATH_PREFIX}/general/forget-password`;
          return handleResponse(res, 400, resolve);
        }

        user.loginAttempts += 1;
        await user.save();
        return res.status(400).json({
          message: "email, phone or password incorrect",
          remainingAttempts: 6 - user.loginAttempts
        })
      }

      const token = this.createToken(user);

      // reset login attempts
      user.loginAttempts = 0;
      await user.save();

      return res
        .status(200)
        .json({
          message: 'Authentication successful',
          token
        });
  
    } catch (error) {
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
  };
  
  /**
   * Logout user
   * @param {Object} req - Express Request
   * @param {Object} res - Express Response
   * @return Payload on Success
   */
  logout(req, res) {
    try {
      let token = req.header('Authorization');
  
      // if token is present then update to the blacklist
      if (token) {
        token = token.substring(7); // remove Bearer
        blacklist.updateBlacklist(token);
      }
  
      return handleResponse(res, 200, "Logout Successful");
    } catch (error) {
      return handleResponse(res, 500, error.message, error);
    }
  };
}

const appController = new AppController()
module.exports = appController;
