require('dotenv').config();
const jwt = require('jsonwebtoken');
const { handleResponse } = require('../utility/handle.response');
const { isTokenBlacklisted } = require('./tokenBlacklist');

/**
 * Middleware to verify admin by token.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
const adminTokenVerification = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return handleResponse(res, 401, 'Unauthorized');
  }

  const secretKey = process.env.ADMINKEY;

  // Remove 'Bearer' from the token
  const tokenWithoutBearer = token.substring(7);

  // Check if the token is blacklisted
  if (isTokenBlacklisted(tokenWithoutBearer)) {
    return handleResponse(res, 401, 'Invalid token');
  }

  jwt.verify(tokenWithoutBearer, secretKey, (err, user) => {
    if (err) {
      return handleResponse(res, 403, 'Invalid token');
    }

    req.user = user;
    next();
  });
};

module.exports = adminTokenVerification;
