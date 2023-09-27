require('dotenv').config();
const jwt = require('jsonwebtoken');

const tokenVerification = (req, res, next) => {
  let token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const secretKey = process.env.SECRETKEY;
  token = token.substring(7); // remove Bearer

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

module.exports = tokenVerification;
