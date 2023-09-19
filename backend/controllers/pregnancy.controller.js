import cycle from "../models/pregnancy.model";
import { handleResponse as HR } from ".responseMiddleware";

/**
 * user can create update and delete pregnancy record
 **/

exports.createPregnancy = async (req, res) => {
	try {
		const pregnancy = new Pregnancy(req.body);
		await pregnancy.save();
		HR(res, HttpStatus.CREATED).json(pregnancy);
	}
	catch(error) {
		HR(res, HttpStatus.BAD_REQUEST).json({ error: "error" });
	}
};
/* user update pregnancy data by Id */
export.createPregnancy = async(req, res) => {

	try {

		const pregnancy = await Pregnancy.findByIdAndUpdate(req.params.id, req.body, {new: true});
		// condition
		if(!pregnancy) {
			return HR(res, HttpStatus.NOT_FOUND).json({ message: "pregancy data not found" });
		}
		HR(res, HttpStatus.OK).json(pregancy);
	}
	catch(error) {
		HR(res, HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "internal server error"});
	}
};
/* Delete pregnancy data by Id */
exports.deletePregnancy = async(req, res) => {
	try {
		const pregnancy = await Pregnancy.findByIdAndRemove(req.params.id);
		if !pregnancy {
			return HR(res, HttpStatus.NOT_FOUND).json({ message: "record not found" });
		}
		HR(res, HttpStatus.OK).json({ message: "record deleted" });
	}
	catch (error) {
		HR(res, HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "internal server error" });
	}
};
