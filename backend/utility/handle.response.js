
/**
 * Handle response sent to user.
 * @param {Object} res - response object
 * @param {} code - Http Status code
 * @param {*} mes - The message to send
 * @returns 
 */
exports.handleResponse = (res, code, mes) => {
    return res.status(code).json({ message: mes });
}
