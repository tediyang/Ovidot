const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const userController = require('../controllers/user.controller');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { handleResponse } = require('../utility/handle.response');
const { updateBlacklist } = require('../middleWare/tokenBlacklist');

// Secret key for jwt signing and verification
const secretKey = process.env.SECRETKEY;

/**
 * create a token for a user that expires 1hr
 * @param {User} user - user object 
 * @returns - token
 */
function createToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
}

/**
 * Create an account for a user
 * @param {Object} req 
 * @param {Object} res 
 * @returns - status 200 and payload
 */
exports.signup = async (req, res) => {
  // Validate the data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleResponse(res, 400, "Fill required properties");
  }

  const { email, password, username, age } = req.body;

  return await userController.create({ email, password, username, age }, res);
}

/**
 * Login a user and generate a token
 * @param {Object} req 
 * @param {Object} res 
 * @returns - status 200 and payload
 */
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

/**
 * Logout a user and expire the token
 * @param {Object} req 
 * @param {Object} res 
 * @returns - status 200
 */
exports.logout = async (req, res) => {
  try {
    let token = req.header('Authorization');

    // if token is present then update to the blacklist
    if (token) {
      token = token.substring(7); // remove Bearer
      updateBlacklist(token);
    }

    return handleResponse(res, 200, 'logged out successfully');
  } catch (error) {
    return handleResponse(res, 500, 'Internal Server Error');
  }
}

/**
 * Change logged-in user password
 * @param {Object} req 
 * @param {Object} res 
 * @returns - Success
 */
exports.changePass = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return handleResponse(res, 400, 'Current password is incorrect');
    }

    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.log(error);
    return handleResponse(res, 500, 'Internal Server Error');
  }
}
