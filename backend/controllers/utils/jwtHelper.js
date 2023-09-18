const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRETKEY;

/**
 * generate a jwt token for a user.
 * @parm {obj} use. the user object to include in the token.
 * @returns {string} = the generated jwt token
 **/
const exports.generateToken = (user) => {
	return jwt.sign({ id: user.id, email: user.email }, secretKey, {expiresIn: "1h" });
};
