const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const userController = require('../controllers/user.controller');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { handleResponse } = require('../utility/handle.response');

// Secret key for jwt signing and verification
const secretKey = process.env.SECRETKEY;

// Generate a jwt token for a user when successfullly logged in
function createToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
}

// Create User account when for sign up
exports.signup = async (req, res) => {
  // Validate the data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // console.log('yes');
  const { email, password, username, age } = req.body;

  return await userController.create({ email, password, username, age }, res);
}

// Login route to generate a JWT token
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    return handleResponse(res, 404, "email doesn't exist");
  }

  const matched = await bcrypt.compare(password, user.password);
  try {
    if (matched) {
        const token = createToken(user);
        res.status(200).json({
          message: 'Authentication successful',
          userId: user._id,
          token});
    } else {
      return handleResponse(res, 401, 'Authentication failed');
    }
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, 'Internal Server Error');
  }
};
