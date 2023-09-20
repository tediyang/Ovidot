const Cycle = require("../models/cycle.model");
const handleResponse = require("../utility/handle.response");

/**
 * user is only permitted to
 * create, update and delete her own cycle
 */
exports.create = async(req, res) => {
	try {
		const { period, ovulation, startdate } = req.body;
		/* define a cycle */

		const newCycle = new Cycle({ 
			month,
			datetime,
			days,
			period,
			ovulation
		});
		const saveCycle = await newCycle.save();
		HR(res, HttpStatus.CREATED, 'Cycle created successfully', savedCycle);
	}
	catch(error) {
		console.error(error);
		HR(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', { error: 'Internal Server Error' });
	}
};

/* update a cycle record by Id */
export const updateCycleById = async(req, res) => {
	try {
		const { month, datetime, days, period, ovulation } = req.body;
		const updatedCycle = await Cycle.findyIdAndUpdate(
			req.params.id,
			{
				month,
				datetime,
				days,
				period,
				ovulation
			},
			{ new: true }
		);
		/* check for condition */
		if (!updatedCycle) {
			HR(res, HttpStatus.NOT_FOUND, "Cycle not found", { message: "Cycle not found" });
			return;
		}
		//else
		HR(res, HttpStatus.OK, "Cycle updated successfully", updatedCycle);
	}
	catch(error) {
		console.error(error);
		HR(res, HttpStatus.INTERNAL_SERVER_ERROR, "internal server error");
	}
};
/* Delete cycle byId */
export const deleteCycleById = async(req, res) => {
	try {
		const deletedCycle = await Cycle.findByIdAndRemove(req.params.id);
		if (!deletedCycle) {
			HR(res, HttpStatus.NOT_FOUND, 'Cycle not found', { message: 'Cycle not found' });
			return;
		}
		HR(res, HttpStatus.OK, "cycle successfully deleted");
	}
	catch(error) {
		HR(res, HttpStatus.INTERNAL_SERVER_ERROR, "internal server error");
	}
};
