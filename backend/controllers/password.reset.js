const nodemailer = require('nodemailer');
const User = require('../models/user.model');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const { handleResponse } = require('../utility/handle.response');
const { isTokenBlacklisted, updateBlacklist } = require('../middleware/tokenBlacklist');

// Secret key
const secretKey = process.env.SECRETKEY;

// Host, Port
const host = process.env.HOST;
const port = process.env.PORT;

/**
 * create a reset token using uuid.v4
 * @returns - a unique uuid.
 */
function resetToken() {
    return uuid.v4();
  }

// Sender details
const emailAddress = process.env.EMAIL;
const emailPassword = process.env.EMAILPASSWORD;

// Create the sender details. user and pass verification is used here, but for more efficient
// security used Auth.
const sender = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: emailAddress,
    pass: emailPassword,
  },
});

/**
 * Generate link to change password.
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.forgotPass = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return handleResponse(res, 404, `${email} not registered`);
    }

    const token = resetToken();
    const resetExp = new Date(Date.now() + 1800000); // 30mins
    user.reset = token;
    user.resetExp = resetExp;
    await user.save();

    const resetLink = `http://${host}:${port}/api/reset-password/${token}`;

    const receiver = {
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetLink}`
    };

    sender.sendMail(receiver, (error, info) => {
      if (error) {
        return handleResponse(res, 500, 'Failed to send email');
      }
      return handleResponse(res, 200, 'Password reset email sent');
    });
  } catch (error) {
    console.log(error);
    return handleResponse(res, 500, 'Internal Server Error');
  }
}

/**
 * reset user's password
 * @param {Object} req
 * @param {Object} res
 * @return - 
 */
exports.VerifyResetPass = async (req, res) => {
  const { token } = req.params;

  if (isTokenBlacklisted(token)) {
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
    message : "success" ,
    token
  })
}

exports.ResetPass = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return handleResponse(res, 401, 'Invalid password or token');
  }

  if (isTokenBlacklisted(token)) {
    return handleResponse(res, 401, 'Invalid or expired token');
  }

  const user = await User.findOne({
    reset: token,
    resetExp: { $gt: Date.now() },
  });

  if (!user) {
    return handleResponse(res, 401, 'Invalid or expired token');
  }

  const saltRounds = 12;
  const salt = await bcrypt.genSalt(saltRounds);
  // Hash the password
  const hashedNewPassword = await bcrypt.hash(password, salt);
  user.password = hashedNewPassword;
  await user.save();

  updateBlacklist(token);

  return handleResponse(res, 200, "Password changed");
}
