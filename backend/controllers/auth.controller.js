const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

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

  const { email, password } = req.body;

  const existUser = await User.findOne({ email });
  if (existUser) {
    return res.status(404).json({
      message: `${email} already exist.`
    });
  }

  try {
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, salt);
    // Register the new user data. The create method prevents sql injection
      const newUser = await User.create({
          email, hashedPassword
      });

      await newUser.save();
      return res.status(201).send();

  } catch (error) {
      console.error(error);
      return res.status(500).json({error: 'Internal Server Error'});
  }
}

// Login route to generate a JWT token
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  const matched = await bcrypt.compare(password, user.password);
  if (matched) {
      const token = generateToken(user);
      res.status(200).json({ message: 'Authentication successful', token });
  }
};
