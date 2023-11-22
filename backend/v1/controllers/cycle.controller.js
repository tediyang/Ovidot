// CYCLE CONTROLLER (CRUD)
import Cycle from '../models/cycle.model';
import { handleResponse } from '../utility/handle.response.js';
import { month as _month, calculate } from '../utility/cycle.calculator.js';
import User from '../models/user.model.js';
import { validationResult } from 'express-validator';
import { populateWithCycles, populateWithCyclesBy } from '../utility/user.populate.js';
import { validateCreateDate, validateUpdateDate } from '../utility/date.validate.js';


/**
 * Parse the data to create the cycle.
 * @param {String} month - Month of Cycle.
 * @param {Number} period - Number of menstrual days.
 * @param {Date} startdate - The first day of the cycle.
 * @param {Object} data - The cycle calculated data.
 * @returns - Data to parse to cycle model.
 */
function cycleParser(month, period, startdate, data ) {
	const result = {
		month: month,
		period: period,
		ovulation: data.ovulation,
		start_date: startdate,
		next_date: data.nextDate,
		days: data.days,
		period_range: data.periodRange,
		ovulation_range: data.ovulationRange,
		unsafe_days: data.unsafeDays
	}
	return result;
}

/**
 * Take in a cycle object and return selected cycle properties.
 * @param {Cycle} cycle.
 * @returns cycles properties.
 */
function cycleFilter(cycle) {
	const result = {
		id: cycle.id,
		month: cycle.month,
		period: cycle.period,
		ovulation: cycle.ovulation,
		start_date: cycle.start_date,
		next_date: cycle.next_date,
		days: cycle.days,
		period_range: cycle.period_range,
		ovulation_range: cycle.ovulation_range,
		unsafe_days: cycle.unsafe_days
	}
	return result;
}

/**
 * Creates a cycle for the user with provided params.
 * @param {Object} req - Express Request
 * @param {Object} res - Express Response
 * @returns Payload on Success
 */
export async function createCycle(req, res) {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
		  return handleResponse(res, 400, "Fill required properties");
		}

		const id = req.user.id;
		const { period, ovulation, startdate } = req.body;

		if (!validateCreateDate(startdate)) {
			return handleResponse(res, 400,
				'Specify a proper date: Date should not be less 3 days or greater than present day');
		}

		// Get the month for the date
		const month = _month(startdate);

		const user = await populateWithCycles(id);
		if (user === null) {
			return handleResponse(res, 404, 'User not found');
		}
		if (user._cycles.length > 0) {
			/**
			 * 1. Get the most recent data for that month.
			 * 2. Get the predicted nextdate for the previous cycle
			 * 3. Get the difference from the new month startdate
			 * 4. If the difference is greater than 10 (10 days) send a
			 * respond requesting for update or delete cycle. This estimate is made based on
			 * an assumption that a woman cycle can't come earlier than 7 days.
			 */
			const lastCycle = user._cycles[user._cycles.length - 1];
			const nextD = new Date(lastCycle.next_date);
			const prevD = new Date(startdate);
			const diff = (nextD - prevD) / (24 * 60 * 60 * 1000);
			if (diff > 7) {
				return handleResponse(res, 400, "Cycle already exist: Update or Delete to create another");
			}
		}
		// if user._cycles is false (no data), create a new one.
		const cycleData = await calculate(period, startdate, ovulation);

		const data = cycleParser(month, period, startdate, cycleData);
		const newCycle = await Cycle({ ...data });

		// Save the new cycle created and update the user with the cycleId
		await newCycle.save();
		user._cycles.push(newCycle._id);
		await User.findByIdAndUpdate(user.id, {
			_cycles: user._cycles
		});

		return res.status(201).json({
			message: 'Cycle created',
			cycleId: newCycle.id
		});

	} catch (error) {
		if (error.statusCode == 400) {
			handleResponse(res, 400, error.message);
		} else {
			console.error(error);
			handleResponse(res, 500, "internal server error");
		}
	}
}

/**
 * fetch all the cycles for a given user
 * @param {Object} req - Express Request
 * @param {Object} res - Express Response
 * @returns Payload on Success
 */ 
export async function fetchAllCycles(req, res) {
	try {
		const id = req.user.id;

		const user = await populateWithCycles(id);
		if (!user) {
			return handleResponse(res, 404, 'User not found');
		}

		const cycles = user._cycles.map(cycleFilter);
		return res.status(200).json(cycles);
	} catch (err) {
		return handleResponse(res, 500, 'Internal Server Error');
	}
}

/**
 * get cycle by cycleId for a given user
 * @param {Object} req - Express Request
 * @param {Object} res - Express Response
 * @returns Payload on Success
 */ 
export async function fetchOneCycle(req, res) {
	try {
		const { cycleId } = req.params;
		const userId = req.user.id;

		const user = await populateWithCyclesBy(userId, '_id', cycleId);
		if (user === null) {
			return handleResponse(res, 404, 'User not found');
		}
		if (user._cycles.length == 0) {
			return handleResponse(res, 404, "Cycle not found");
		}

		const cycle = cycleFilter(user._cycles[0]);
		return res.status(200).json(cycle);
	} catch (err) {
		console.log(err);
		return handleResponse(res, 500, 'Internal Server Error');
	}
}

/**
 * Get cycle by month for a given user
 * @param {Object} req - Express Request
 * @param {Object} res - Express Response
 * @returns Payload on Success
 */
export async function fetchMonth(req, res) {
	try {
		let { month } = req.params;
		const userId = req.user.id;

		month = month.charAt(0).toUpperCase() + month.slice(1);

		const user = await populateWithCyclesBy(userId, 'month', month);
		if (user === null) {
			return handleResponse(res, 404, 'User not found');
		}
		return res.status(200).json(user._cycles);
	} catch (err) {
		console.log(err);
		return handleResponse(res, 500, 'Internal Server Error');
	}
}

/**
 * update a cycle record by cycleId for a given user
 * @param {Object} req - Express Request
 * @param {Object} res - Express Response
 * @returns Payload on Success
 */
export async function updateCycle(req, res) {
	try {
		const { cycleId } = req.params;
		const userId = req.user.id;
		let { period, ovulation } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return handleResponse(res, 404, "User not found");
		}

		const cycle = await Cycle.findById(cycleId);
		if (!cycle) {
			return handleResponse(res, 404, "Cycle not found");
		}

		/**
		 * validate update startDate.
		 * This is to avoid error in date when a user doesn't visit her profile
		 * and the model continues by predicting the cycle further. When the user visit again,
		 * the user can change startdate but this date must fall between the valid past days.
		 * This range is made based on the assumption that a user's cycle can't come earlier than
		 * 10 days.
		 */
		if (!period && !ovulation) {
			return handleResponse(res, 400, "Provide atleast a param to update");
		}
		if (ovulation) {
			if (!validateUpdateDate(cycle.start_date, ovulation)) {
				return handleResponse(res, 400, 'Ovulation date must not exceed 18 days from start date');
			}
		}
		if (!period) {
			period = cycle.period;
		}

		const updated_at = new Date();
		const month = _month(cycle.start_date);
		const updatedData = await calculate(period, cycle.start_date, ovulation);
		const data = cycleParser(month, period, cycle.start_date, updatedData);
		const updatecycle = await Cycle.findByIdAndUpdate(cycleId, {
			...data,
			updated_at: updated_at
		},
		{ new: true });

		const updated = cycleFilter(updatecycle);
		return res.status(200).json({
			updated
		});
	}
	catch (error) {
		if (error.statusCode == 400) {
			handleResponse(res, 400, error.message);
		} else {
			console.error(error);
			handleResponse(res, 500, "internal server error");
		}
	}
}

/**
 * Delete cycle by cycleId for a given use
 * @param {Object} req - Express Request
 * @param {Object} res - Express Response
 * @returns Payload on Success
 */
export async function deleteCycle(req, res) {
	try {
		const { cycleId } = req.params;
		const userId = req.user.id;
		const user = await populateWithCycles(userId, '_id', cycleId);
		if (user === null) {
			return handleResponse(res, 404, "User not found");
		}
		if (user._cycles.length == 0) {
			return handleResponse(res, 404, "Cycle not found");
		}
		await Cycle.findByIdAndRemove(cycleId);
		return res.status(204).send('Cycle deleted');
	}
	catch (error) {
		console.log(err);
		handleResponse(res, 500, "internal server error");
	}
};
