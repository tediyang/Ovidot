require('dotenv').config();
const jwt = require('jsonwebtoken');
const { handleResponse } = require('../utility/handle.response');
const { isTokenBlacklisted } = require('./tokenBlacklist');

// Verify admin by token
const adminTokenVerification = (req, res, next) => {
  let token = req.header('Authorization');

  if (!token) {
    return handleResponse(res, 401, 'Unauthorized');
  }

  const secretKey = process.env.ADMINKEY;
  token = token.substring(7); // remove Bearer

  // Check if the token is blacklisted
  if (isTokenBlacklisted(token)) {
    return handleResponse(res, 401, 'Invalid token');
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return handleResponse(res, 403, 'Invalid token');
    }

    req.user = user;
    next();
  });
};

module.exports = adminTokenVerification;
