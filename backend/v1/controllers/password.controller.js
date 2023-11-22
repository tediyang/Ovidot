import { createTransport } from 'nodemailer';
import User from '../models/user.model.js';
import { v4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { handleResponse } from '../utility/handle.response.js';
import { isTokenBlacklisted, updateBlacklist } from '../middleware/tokenBlacklist.js';
import { validationResult } from 'express-validator';

const { genSalt, hash, compare } = bcrypt;

// Host, Port
const host = process.env.HOST;
const port = process.env.PORT;

// Sender details
const emailAddress = process.env.EMAIL;
const emailPassword = process.env.EMAILPASSWORD;

/**
 * create a reset token using uuid.v4
 * @returns - a unique uuid.
 */
function resetToken() {
    return v4();
  }


/**
 * Create the sender details. user and pass verification is used here, but for more efficient
 * security used Auth. */
const sender = createTransport({
  service: 'Gmail',
  auth: {
    user: emailAddress,
    pass: emailPassword,
  },
});

/**
 * Send reset link password to users
 * @param {Object} req - Express Request
 * @param {Object} res - Express Response
 * @return Payload on Success
*/
export async function forgotPass(req, res) {
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
      text: `Click the following link to reset your password: ${resetLink}, do not share this link with anyone.
      This link will expire in 30 mins. If you didn't make this request then ignore it.`,
    };

    sender.sendMail(receiver, (error, info) => {
      if (error) {
        return handleResponse(res, 500, 'Failed to send email');
      }
      return handleResponse(res, 201, 'Password reset link sent to email');
    });
  } catch (error) {
    console.log(error);
    return handleResponse(res, 500, 'Internal Server Error');
  }
}

/**
 * Validate reset token
 * @param {Object} req - Express Request
 * @param {Object} res - Express Response
 * @return Payload on Success
*/
export async function VerifyResetPass(req, res) {
  const { token } = req.params;

  if (!token) return handleResponse(res, 401, 'Invalid or expired token');

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

/**
 * Reset user's password
 * @param {Object} req - Express Request
 * @param {Object} res - Express Response
 * @return Payload on Success
 */
export async function ResetPass(req, res) {
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
  const salt = await genSalt(saltRounds);
  // Hash the password
  const hashedNewPassword = await hash(password, salt);
  user.password = hashedNewPassword;
  await user.save();

  updateBlacklist(token);

  return handleResponse(res, 200, "Password changed");
}

/**
 * Change logged-in user password
 * @param {Object} req - Express Request
 * @param {Object} res - Express Response
 * @return Payload on Success
 */
export async function changePass(req, res) {
  try {
    // validate the request
    const errors = validationResult(req);
		if (!errors.isEmpty()) {
		  return handleResponse(res, 400, "Fill required properties");
		}

    const { currentPassword, newPassword } = req.body;

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return handleResponse(res, 400, 'Current password is incorrect');
    }

    const saltRounds = 12;
    const salt = await genSalt(saltRounds);
    const hashedNewPassword = await hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    return res.status(204).send('Password changed');
  } catch (error) {
    console.log(error);
    return handleResponse(res, 500, 'Internal Server Error');
  }
}
