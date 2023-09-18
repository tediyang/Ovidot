/* This is validationMiddleware 
 * it checks if email address is valid email
 * and password is more than 8 char
 * if any validation error it returns bad_request
 * */

const = { body, validationResult } = require("express-validator");
const = HttpStatus = require("http-status-codes");

const createUserValidation = [
	body("email").isEmail().withMessage("invalid email address"),
	body("password").isLength({ min: 8 }).withMessage("password must not be < 8"),
];

const updateUserValidation = [
	body("email").isEmail().withMessage("invalid email address"),
	body("password").isLength({ min: 8 }).withMessage("Password must not be < 8")
];

const validate = (req, res, next) => {
	const errors = ValidationResult(req);
	if(!errors.isEmpty())  {
		return res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
	}
	next();
};
module.exports = {
	createUserValidation,
	updateUserValidation,
	validate
};
