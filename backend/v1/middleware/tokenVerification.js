// User Token Verification
const { verify } = require('jsonwebtoken');
const handleResponse = require('../utility/helpers/handle.response');
const blacklist = require('./tokenBlacklist');
const { userStatus } = require('../enums');
const { User, Admin } = require('../models/engine/database');
const { PATH_PREFIX } = require('../swagger-docs')


class TokenVerification {

  /**
   * Verify user's token
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns 
   */
  async userTokenVerification (req, res, next) {
    let token = req.header('Authorization');

    if (!token) {
      return handleResponse(res, 401, 'Unauthorized');
    }

    const secretKey = process.env.SECRETKEY;
    token = token.substring(7); // remove Bearer

    // Check if the token is blacklisted
    if (blacklist.isTokenBlacklisted(token)) {
      return res.status(401).json({
        msg: 'Token logged out, get a new access token at /api/v1/refresh-token or login again',
        second_chance: true
      });
    }

    verify(token, secretKey, async (err, user) => {
      if (err) {
        return res.status(401).json({
          msg: 'Token expired, get a new access token at /api/v1/refresh-token or login again',
          second_chance: true
        });
      }

      const found = await User.findById(user.id);
      if (found && found.status !== userStatus.active) {
        const resolve = `${PATH_PREFIX}/general/forget-password/`;
        return res.status(401).json({
          message: "Account Deactivated",
          resolve
        });
      };

      req.user = user;
      req.token = token;
      next();
    });
  };

  /**
   * Verify admin token
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void}
   */
  async adminTokenVerification (req, res, next) {
    let token = req.header('Authorization');
    if (!token) {
      return handleResponse(res, 401, 'Unauthorized');
    }

    // import secret key
    const secretKey = process.env.ADMINKEY;
    token = token.substring(7);

    // Check if the token is blacklisted
    if (blacklist.isTokenBlacklisted(token)) {
      return handleResponse(res, 401, 'Invalid token');
    }

    // verify the token
    verify(token, secretKey, async (err, user) => {
      if (err) {
        return handleResponse(res, 401, 'Invalid token');
      }

      const found = await Admin.findById(user.id);
      if (found && found.status !== userStatus.active) {
        const resolve = `contact super admin`;
        return res.status(401).json({
          message: "Account Deactivated",
          resolve
        });
      };

      req.user = user;
      req.token = token;
      next();
    });
  };
}


const tokenVerification = new TokenVerification();
module.exports = tokenVerification;
