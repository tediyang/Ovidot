// REGISTER CONTROLLER
const { User, MongooseError } = require("../models/engine/database.js");
const { sign, JsonWebTokenError, verify } = require("jsonwebtoken");
const { compare } = require("bcrypt");
const { PATH_PREFIX } = require("../swagger-docs");
const userController = require("./user.controller.js");
const handleResponse = require("../utility/helpers/handle.response.js");
const blacklist = require("../middleware/tokenBlacklist.js");
const requestValidator = require("../utility/validators/requests.validator.js");
const { userStatus } = require("../enums.js");
const Joi = require("joi");
require("dotenv").config();

// Secret key for jwt signing and verification
const secretKey = process.env.SECRETKEY;

class AppController {
  /**
   * Generates a token based on the provided payload.
   *
   * @param {Object} payload - The payload used to generate the token.
   * @param {boolean} just_access=false - Determines if only the access token should be generated.
   * @return {string|Object} - The generated token(s).
   */
  async createToken(payload, just_access = false) {
    try {
      if (just_access) {
        const accessToken = sign(
          { id: payload._id, email: payload.email, status: payload.status },
          secretKey,
          { expiresIn: "5h" },
        );
        return accessToken;
      }
      const accessToken = sign(
        { id: payload._id, email: payload.email, status: payload.status },
        secretKey,
        { expiresIn: "5h" },
      );
      const refreshToken = sign({ id: payload._id }, secretKey, {
        expiresIn: "7d",
      });
      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Root route of the API.
   * @param {Object} req - Express Request
   * @param {Object} res - Express Response
   * @returns {void}
   */
  async home(req, res) {
    return handleResponse(res, 200, "Welcome to Ovidot API - For help visit '/api/v1/documentation");
  }

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

      return await userController.createUser(res, { ...value });
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
      return handleResponse(res, 500, error.message, error);
    }
  }

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
      const [phone, email] = await Promise.all([
        User.findOne({ phone: value.email_or_phone }),
        User.findOne({ email: value.email_or_phone }),
      ]);
      const user = phone || email;
      if (!user) {
        return handleResponse(res, 400, "email or phone incorrect");
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
          message: "password incorrect",
          remainingAttempts: 6 - user.loginAttempts,
        });
      }

      const tokens = await this.createToken(user);

      // reset login attempts
      user.loginAttempts = 0;
      user.jwtRefreshToken = tokens.refreshToken;
      await user.save();

      return res.status(200).json({
        message: "Authentication successful",
        tokens,
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
      return handleResponse(res, 500, error.message, error);
    }
  }

  /**
   * Logout user
   * @param {Object} req - Express Request
   * @param {Object} res - Express Response
   * @return Payload on Success
   */
  async logout(req, res) {
    try {
      let token = req.header("Authorization");
      const user = await User.findById(req.user.id);

      // if token is present then update to the blacklist
      if (token) {
        token = token.substring(7); // remove Bearer
        blacklist.updateBlacklist(token);

        // reset refresh token
        user.jwtRefreshToken = "";
        await user.save();
      }

      return handleResponse(res, 200, "Logout Successful");
    } catch (error) {
      return handleResponse(res, 500, error.message, error);
    }
  }

  /**
   * Refreshes the access token for a user.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The response containing the new access token and user information.
   */
  async refreshToken(req, res) {
    try {
      // validate body
      const { token } = req.params;
      let userPayload;

      if (!token) return handleResponse(res, 401, "Requires a token");
      // validate refresh_token
      try {
        userPayload = await new Promise((resolve, reject) => {
          verify(token, process.env.SECRETKEY, (err, user) => {
            if (err) return reject(err);
            resolve(user);
          });
        });
      } catch (error) {
        return res.status(401).json({
          message: "Invalid Credential, Refresh token invalid",
          second_chance: false,
        });
      }

      const user = await User.findById(
        userPayload.id,
        "jwtRefreshToken email _id status",
      ).exec();
      if (!user) {
        return handleResponse(res, 404, "User not found");
      }

      // validate refresh user's refresh_token
      if (user.jwtRefreshToken !== token) {
        return handleResponse(
          res,
          400,
          "Invalid Credential, Refresh token invalid",
        );
      }

      if (user.status !== userStatus.active) {
        const resolve = `${PATH_PREFIX}/general/forget-password/`;
        return res.status(401).json({
          message: "Account Deactivated",
          resolve,
        });
      }

      // refresh access token
      const newAccessToken = await this.createToken(
        {
          _id: user._id,
          email: user.email,
          status: user.status,
        },
        true,
      );

      return res.status(200).json({
        message: "Token refresh successful",
        token: newAccessToken,
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
      return handleResponse(res, 500, error.message, error);
    }
  }
}

const appController = new AppController();
module.exports = appController;
