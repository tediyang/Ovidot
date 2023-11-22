// error.middleware.js

// Custom error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging (you can customize this part)
  console.error(err);

  // Handle specific types of errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // Handle JSON parse error (e.g., invalid JSON in request body)
    return res.status(400).json({ error: 'Bad Request: Invalid JSON' });
  }

  // Handle other types of errors or return a generic error response
  return res.status(500).json({ error: 'Internal Server Error' });
};

export default errorHandler;
