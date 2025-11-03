// PASSWORD CONTROLLER
require('dotenv').config();
const { User, Email, MongooseError, Connection } = require('../models/engine/database');
const { v4 } = require('uuid');
const handleResponse = require('../utility/helpers/handle.response');
const blacklist = require('../middleware/tokenBlacklist');
const { emailType, userStatus, userAction } = require('../enums');
const requestValidator = require('../utility/validators/requests.validator');
const notifications = require('../services/notifications');
const util = require('../utility/encryption/cryptography');
const Joi = require('joi');
const { JsonWebTokenError } = require('jsonwebtoken');


class PasswordController {

  /**
   * Default reset token expiration time (30 minutes).
   * @constant {number}
   */
  RESET_TOKEN_EXPIRATION = 30 * 60 * 1000;

  /**
   * Generate a reset token using uuid.v4.
   * @returns {string} A unique uuid.
   */
  resetToken() {
    return v4();
  }

  /**
   * Send reset link password to users.
   * @param {Object} req - Express Request
   * @param {Object} res - Express Response
   * @return {void}
   */
  async forgotPass(req, res) {
    try {
      // validate user input
      const { value, error } = requestValidator.ForgetPass.validate(req.body);
      
      if (error) {
        throw error;
      }
  
      const { email, front_url } = value;
  
      const user = await User.findOne({ email: email });
      if (!user) {
        return handleResponse(res, 404, `${email} not found`);
      }
  
      const token = this.resetToken();
      const resetExp = new Date(Date.now() + this.RESET_TOKEN_EXPIRATION);
      const resetLink = `${front_url}/${token}`;
      // await user.save();
      
      await Connection.transaction(async () => {
        user.reset = token;
        user.resetExp = resetExp;
  
        try {
          // Send email
          const email = await Email.create({
            email: user.email,
            username: user.name.fname,
            email_type: emailType.forget,
            content: {
              resetLink: resetLink,
              userAgents: {
                os: req.headers.os,
                browser: req.headers.browser
              }
            }
          });
  
          await Promise.all([email, user.save()]);
        } catch (error) {
          throw error
        }
      });
  
      return handleResponse(res, 201, `Password reset link succesfully sent to ${value.email}`);
  
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
  }
  
  /**
   * Validate reset token.
   * @param {Object} req - Express Request
   * @param {Object} res - Express Response
   * @return {void}
   */
  async VerifyResetPass(req, res) {
    try {
      const { token } = req.params;
  
      if (!token) return handleResponse(res, 401, 'Requires a token');
  
      if (blacklist.isTokenBlacklisted(token)) {
        return handleResponse(res, 401, 'Invalid or expired token');
      }
  
      const user = await User.findOne({
        reset: token,
        resetExp: { $gt: Date.now() },
      });
  
      if (!user) {
        return handleResponse(res, 401, 'Invalid or expired token');
      }
  
      return res.status(200).json({
        message: "success",
        token
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
   * Reset user's password.
   * @param {Object} req - Express Request
   * @param {Object} res - Express Refront_urlsponse
   * @return {void}
   */
  async ResetPass(req, res) {
    try {
      // validate user input
      const { value, error } = requestValidator.ResetPass.validate(req.body);
  
      if (error) {
        throw error;
      }
  
      const { token, new_password} = value;
  
      if (blacklist.isTokenBlacklisted(token)) {
        return handleResponse(res, 401, 'Invalid request, expired token');
      }
  
      const user = await User.findOne({
        reset: token,
        resetExp: { $gt: Date.now() },
      });
  
      if (!user) {
        return handleResponse(res, 401, 'Invalid request, expired token');
      }
  
      user.password = await util.encrypt(new_password);
      if (user.status == userStatus.deactivated) user.status = userStatus.active;

      // reset login attempts
      user.loginAttempts = 0;

      // reset refresh token
      user.jwtRefreshToken = '';

      await Connection.transaction(async () => {
			// Generate notification
        const message = 'Your password has been successfully reset';
        const notify = await notifications.generateNotification(userAction.resetPassword, message);

        // Add the notification
        user.notificationsList.push(notify);
        await notifications.manageNotification(user.notificationsList);

        await Promise.all([blacklist.updateBlacklist(token), user.save()]);
      });
  
      return handleResponse(res, 200, "Password successfully updated");
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
  }
}


const passwordController = new PasswordController()
module.exports = passwordController;
