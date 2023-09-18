// responseMiddleware.js

const handleResponse = (res, status, message) => {
  return res.status(status).json({ message });
};

module.exports = {
  handleResponse,
};
