const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const userController = require('../controllers/user.controller');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const handleResponse = require('../utility/handle.response');

// Secret key for jwt signing and verification
const secretKey = process.env.SECRETKEY;

// Generate a jwt token for a user when successfullly logged in
function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
}

// Create User account when for sign up
exports.signup = async (req, res, next) => {
  // Validate the data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, username, age } = req.body;

  return await userController.create({ email, password, username, age });
}

// Login route to generate a JWT token
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    return handleResponse(res, 401, 'Authentication failed');
  }

  const matched = await bcrypt.compare(password, user.password);
  try {
    if (matched) {
        const token = createToken(user);
        res.status(200).json({ message: 'Authentication successful', token });
    } else {
      return handleResponse(res, 401, 'Authentication failed');
    }
  } catch (error) {
    console.error(error);
    return handleResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
  }
};
