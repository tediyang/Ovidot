const rateLimit = require('express-rate-limit');

const isTestEnv = () => process.env.ENVIR === 'test' || process.env.ENVIR === 'dev';

const limitMessage = { message: 'Too many requests, please try again later.' };

// For authentication-sensitive endpoints: login, signup, password reset
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: limitMessage,
  standardHeaders: true,
  legacyHeaders: false,
  skip: isTestEnv,
});

// For token-related endpoints: refresh-token, verify reset token
const tokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: limitMessage,
  standardHeaders: true,
  legacyHeaders: false,
  skip: isTestEnv,
});

// General API rate limit applied globally
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: limitMessage,
  standardHeaders: true,
  legacyHeaders: false,
  skip: isTestEnv,
});

module.exports = { authLimiter, tokenLimiter, apiLimiter };
