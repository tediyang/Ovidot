import { sign } from 'jsonwebtoken';
import User from '../models/user.model';
import { create } from './user.controller';
import { compare } from 'bcryptjs';
import { validationResult } from 'express-validator';
import { handleResponse } from '../utility/handle.response';
import { updateBlacklist } from '../middleware/tokenBlacklist';

// Secret key for jwt signing and verification
const secretKey = process.env.SECRETKEY;

// Generate token for user. Expiration 5hrs
function createToken(user) {
  return sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '5h' });
}

/** Register user */
export async function signup(req, res) {
  // Validate the data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleResponse(res, 400, "Fill required properties");
  }

  const { email, password, username, age } = req.body;

  return await create({ email, password, username, age }, res);
}

/** Login user */
export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    return handleResponse(res, 404, "email doesn't exist");
  }

  const matched = await compare(password, user.password);
  try {
    if (matched) {
        const token = createToken(user);
        res.status(200).json({
          message: 'Authentication successful',
          token});
    } else {
      return handleResponse(res, 401, 'Authentication failed');
    }
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, 'Internal Server Error');
  }
}

/** Logout user */
export async function logout(req, res) {
  try {
    let token = req.header('Authorization');

    // if token is present then update to the blacklist
    if (token) {
      token = token.substring(7); // remove Bearer
      updateBlacklist(token);
    }

    return res.status(200).send();
  } catch (error) {
    return handleResponse(res, 500, 'Internal Server Error');
  }
}