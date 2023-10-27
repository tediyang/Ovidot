/**
 * Handle response sent to user.
 * @param {Object} res - response object
 * @param {HTTP} code - Http Status code
 * @param {String} mes - The message to send
 * @returns 
 */
exports.handleResponse = (res, code, mes) => {
    return res.status(code).json({ message: mes });
}
