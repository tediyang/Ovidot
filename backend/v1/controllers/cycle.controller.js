// CYCLE CONTROLLER (CRUD)
const { Cycle, MongooseError } = require('../models/engine/database.js');
const CycleCalculator = require('../utility/helpers/cycle.calculator.js');
const userPopulate = require('../utility/helpers/user.populate.js');
const dateValidator = require('../utility/validators/date.validator.js');
const requestValidator = require('../utility/validators/requests.validator.js');
const redisManager = require('../services/caching.js');
const handleResponse = require('../utility/helpers/handle.response.js');
const cycleParser = require('../utility/helpers/cycle.parsers.js');
const cycleHelper = require('../utility/helpers/cycle.helpers.js');
const Joi = require('joi');
const { JsonWebTokenError } = require('jsonwebtoken');

// Initiate the cycle calculator
const cycleCalculator = new CycleCalculator();


class CycleController {

	/**
	 * Creates a cycle for the user with provided params.
	 * @param {Object} req - Express Request
	 * @param {Object} res - Express Response
	 * @returns Payload on Success
	 */
	async createCycle(req, res) {
		try {
			// validate user input
			const { value, error } = requestValidator.CreateCycle.validate(req.body);

			if (error) {
				throw error;
			};

			const id = req.user.id;
			let { period, ovulation, startdate } = value;
			
			const user = await userPopulate.populateWithCycles(id);
			if (user === null) {
				return handleResponse(res, 404, 'User not found');
			};
			
			if (!dateValidator.validateCreateDate(startdate)) {
				return handleResponse(res, 400, 'Specify a proper date: Date should not be less than 21 days or greater than present day');
			};
			
			// Get the month for the date
			const month = cycleCalculator.getMonth(startdate);
			
			if (cycleHelper.checkExistingCycle(user, startdate)) {
				return handleResponse(res, 400, "Cycle already exist for this month: Delete to create another");
			};
			
			// if period wasn't given
			if (!period) {
				period = user.period;
			}

			// if user._cycles is false (no data), create a new one.
			const cycleData = await cycleCalculator.calculate(period, startdate, ovulation);
			
			const data = cycleParser.Parse(month, period, startdate, cycleData);
			const newCycle = await Cycle.create({...data});

			// Create the cycle and notification for the user
			await cycleHelper.createCycleAndNotifyUser(newCycle, user, startdate);

			// Handle cache
			await Promise.resolve(redisManager.cacheDel(id, newCycle.year.toString()));

			return res
				.status(201)
				.json({
					message: 'Cycle created',
					cycleId: newCycle.id
			});

		} catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof Joi.ValidationError) {
				return handleResponse(res, 400, error.details[0].message);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
			return handleResponse(res, 500, error.message, error)
		}
	}
	
	/**
	 * fetch all the cycles for a given user
	 * @param {Object} req - Express Request
	 * @param {Object} res - Express Response
	 * @returns Payload on Success
	 */
	async fetchAllCycles(req, res) {
		try {
			const { value, error } = requestValidator.GetCycles.validate(req.query);

			if (error) {
				throw error;
			};

			const { month, year, period } = value;
			let cycles;

			// Check for cache
			cycles = await redisManager.cacheGet(req.user.id, year.toString());
			if (cycles) {
				const parsedCycles = JSON.parse(cycles);
				const filtered = month && period ?
					parsedCycles.filter((cycle) => cycle.month === month && cycle.period == period):
					month ? parsedCycles.filter((cycle) => cycle.month === month) :
					period ? parsedCycles.filter((cycle) => cycle.period == period) : JSON.Parse(cycles);
				return res.status(200).json(filtered);
			}

			const search = {}
			search.year = year;
			if (month || period) {
				if (month) {
					search.month = month;
				}
				if (period) {
					search.period = period;
				}
			}

			const user = await userPopulate.populateWithCyclesBy(req.user.id, search);
			if (!user) {
				return handleResponse(res, 404, 'User not found');
			};

			cycles = user._cycles.map(cycleParser.Filter);
	
			// Cache data if year is provided
			if (cycles) {
				redisManager.cacheSet(req.user.id, year.toString(), JSON.stringify(cycles));
			}
	
			return res
				.status(200)
				.json(
					cycles
				);
		} catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof Joi.ValidationError) {
				return handleResponse(res, 400, error.details[0].message);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
			return handleResponse(res, 500, error.message, error);
		}
	}
	
	/**
	 * get cycle by cycleId for a given user
	 * @param {Object} req - Express Request
	 * @param {Object} res - Express Response
	 * @returns Payload on Success
	 */ 
	async fetchOneCycle(req, res) {
		try {
			const { cycleId } = req.params;
			const userId = req.user.id;
	
			const user = await userPopulate.populateWithCyclesBy(userId, {_id: cycleId});
			if (user === null) {
				return handleResponse(res, 404, 'User not found');
			}
			if (user._cycles.length == 0) {
				return handleResponse(res, 404, "Cycle not found");
			}
	
			const cycle = cycleParser.Filter(user._cycles[0]);
			return res
				.status(200)
				.json(
					cycle
				);
		} catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
			return handleResponse(res, 500, error.message, error);
		}
	}
	
	/**
	 * update a cycle record by cycleId for a given user
	 * @param {Object} req - Express Request
	 * @param {Object} res - Express Response
	 * @returns Payload on Success
	 */
	async updateCycle(req, res) {
		try {
			// validate user input
			const { value, error } = requestValidator.UpdateCycle.validate(req.body);
	
			if (error) {
				throw error;
			};
	
			const { cycleId } = req.params;
			const userId = req.user.id;
			let { period, ovulation } = value;
	
			const user = await userPopulate.populateWithCyclesBy(userId, {_id: cycleId});
			if (user === null) {
				return handleResponse(res, 404, 'User not found');
			}
			if (user._cycles.length == 0) {
				return handleResponse(res, 404, "Cycle not found");
			}
	
			const cycle = cycleParser.Filter(user._cycles[0]);

			if (period && ovulation && period === cycle.period && new Date(ovulation).getTime() === cycle.ovulation.getTime()) {
				return handleResponse(res, 400, "Can't update the cycle with the same period and ovulation");
			}
			if (period && !ovulation && period === cycle.period) {
				return handleResponse(res, 400, "Can't update the cycle with the same period");
			}
			if (!period && ovulation && new Date(ovulation).getTime() === cycle.ovulation.getTime()) {
				return handleResponse(res, 400, "Can't update the cycle with the same ovulation");
			}

			// if startdate is 30 days below current date, then update isn't possible
			if (new Date() > new Date(cycle.start_date).setDate(new Date(cycle.start_date).getDate() + 30)) {
				return handleResponse(res, 400, "Update can't be made after 30 days from current cycle start date");
			};
	
			// Validate the ovulation date.
			if (ovulation && !dateValidator.validateUpdateDate(cycle.start_date, ovulation, cycle.period)) {
				return handleResponse(res, 400, 'Ovulation date must not exceed 18 days from start date');
			}
	
			// If period is not provided, then use the current period
			if (!period) {
				period = cycle.period;
			}
	
			// Update and notify user
			const updatedCycle = await cycleHelper.performUpdateAndNotify(cycle, period, ovulation, cycleId, user);

			const updated = cycleParser.Filter(updatedCycle);
	
			// Handle cache
			await Promise.resolve(redisManager.cacheDel(userId, updated.year.toString()));		
	
			return res
				.status(200)
				.json({
					updated
			});
		}
		catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof Joi.ValidationError) {
				return handleResponse(res, 400, error.details[0].message);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
			return handleResponse(res, 500, error.message, error);
		}
	}
	
	/**
	 * Delete cycle by cycleId for a given use
	 * @param {Object} req - Express Request
	 * @param {Object} res - Express Response
	 * @returns Payload on Success
	 */
	async deleteCycle(req, res) {
		try {
			const { cycleId } = req.params;
			const userId = req.user.id;

			const user = await userPopulate.populateWithCyclesBy(userId, {_id: cycleId});
			if (user === null) {
				return handleResponse(res, 404, "User not found");
			}
			if (user._cycles.length == 0) {
				return handleResponse(res, 404, "Cycle not found");
			}
	
			// Delete and notify user
			const deletdCycle = await cycleHelper.performDeleteAndNotify(cycleId, user)
	
			// Handle cache
			await Promise.resolve(redisManager.cacheDel(userId, deletdCycle.year.toString()));
	
			return handleResponse(res, 204);
		} catch (error) {
			if (error instanceof MongooseError) {
				return handleResponse(res, 500, "We have a mongoose problem", error);
			}
			if (error instanceof JsonWebTokenError) {
				return handleResponse(res, 500, error.message, error);
			}
			return handleResponse(res, 500, error.message, error)
		}
	};
};


const cycleController = new CycleController();
module.exports = cycleController;
