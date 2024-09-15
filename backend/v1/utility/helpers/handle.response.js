const { logger } = require("../../middleware/logger.js");

/**
 * Handle response sent to user.
 * @param {Object} res - response object
 * @param {HTTP} code - Http Status code
 * @param {String} mes - The message to send
 * @param {Object} error - error object
 * @returns 
 */
function handleResponse(res, code, mes=null, error=null) {
    if (code == 500) logger.error(error);
    return res.status(code).json(error ? { message: mes, error: error.message } : { message: mes });
}

module.exports = handleResponse;
