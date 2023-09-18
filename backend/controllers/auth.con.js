import { handleResponse as HR } from "./responseMiddleware"
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import bcrypt from "bcryptjs"
import { createUserValidation, updateUserValidation, validate, HttpStatus } from "./validationMiddleware";
import { generateToken as GT } from "./jwtHelper";

const saltRounds = 12;
const matched = await bcrypt.compare(password, user.password);
const secretkey = process.env.SECRETKEY;

export const signup = [
	createUserValidation,
	validate,
	async (req, res) => {
		try {
			const { email, password } = req.body;
			const existUser = await User.findOne({ email });

			if (existUser) {
				return HR(res, HttpStatus.CONFLICT, `${email} already exists.`);
			}
			const encryptedPassword = await bcrypt.hash(password, saltRounds);
			await User.create({ email, password: encryptedPassword});
			return HR(res, HttpStatus.CREATED, "User created successfully");
		}
		catch(error) {
			return HR(res, HttpStatus.INTERNAL_SERVER_ERROR, "internal server error");
		}
	}
]

export const login = [
	updateUserValidation,
	validate,
	async (req, res) => {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ email });
			if(!user) {
				return HR(res, HttpStatus.UNAUTHORIZED, 'Authentication failed');
			}

			if(!matched) {
				return HR(res, HttpStatus.UNAUTHORIZED, 'Authentication failed');
			}
			const token = GT(user);
			return HR(res, HttpStatus.OK, "Authentication successful", { token });
		}
		catch(error) {
			console.error(error);
			return HR(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
		}
	},
];
